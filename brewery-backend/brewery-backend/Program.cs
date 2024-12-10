using System;
using System.Linq;
using brewery_backend.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<MongoDbService>();
builder.Services.AddSingleton<MqttService>();

// Dodanie polityki CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:4200") // Adres twojego frontendu
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddSingleton(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var blockchainSettings = configuration.GetSection("Blockchain");
    var rpcUrl = blockchainSettings["RpcUrl"];
    var contractAddress = blockchainSettings["ContractAddress"];
    var adminPrivateKey = blockchainSettings["AdminPrivateKey"];
    var abi = blockchainSettings["ContractAbi"];
    return new BlockchainService(rpcUrl, contractAddress, adminPrivateKey, abi);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Zastosowanie polityki CORS
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

var mongoDbService = app.Services.GetRequiredService<MongoDbService>();

if (await mongoDbService.TestConnectionAsync())
{
    Console.WriteLine("Połączenie z bazą danych MongoDB zostało nawiązane pomyślnie!");
    
    var sensorData = await mongoDbService.GetAllSensorDataAsync();
    foreach (var data in sensorData)
    {
        Console.WriteLine($"SensorType: {data.SensorType}, Value: {data.Value}, Timestamp: {data.Date}");
    }
}
else
{
    Console.WriteLine("Nie udało się nawiązać połączenia z bazą danych MongoDB.");
}


var mqttService = app.Services.GetRequiredService<MqttService>();
await mqttService.StartListeningAsync();

app.MapGet("/api/sensordata", async (MongoDbService mongoDbService) =>
    {
        var sensorData = await mongoDbService.GetAllSensorDataAsync();
        return Results.Ok(sensorData); // Zwraca dane w formacie JSON
    })
    .WithName("GetAllSensorData")
    .WithOpenApi();

app.MapGet("/api/sensordata/daterange", async (MongoDbService mongoDbService, DateTime start, DateTime end) =>
    {
        var sensorData = await mongoDbService.GetSensorsDataInDateRangeAsync(start, end);
        return Results.Ok(sensorData);
    })
    .WithName("GetSensorsDataInDateRange")
    .WithOpenApi();

app.MapGet("/api/sensordata/latest", async (MongoDbService mongoDbService, int sensorNr, int howManyRecords) =>
    {
        var sensorData = await mongoDbService.GetLatestSensorDataAsync(sensorNr, howManyRecords);
        return Results.Ok(sensorData);
    })
    .WithName("GetLatestSensorData")
    .WithOpenApi();

app.MapGet("/api/sensordata/latest/avg", async (MongoDbService mongoDbService, int sensorNr, int howManyRecords) =>
    {
        var average = await mongoDbService.GetSensorLatestAvgAsync(sensorNr, howManyRecords);
        return Results.Ok(average);
    })
    .WithName("GetSensorLatestAvg")
    .WithOpenApi();

app.MapGet("/api/sensors/info", async (BlockchainService blockchainService) =>
    {
        try
        {
            var sensorsInfo = await blockchainService.GetAllSensorsInfoAsync();
            return Results.Ok(sensorsInfo);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Wystąpił błąd podczas pobierania informacji o sensorach: {ex.Message}");
            return Results.Problem("Wystąpił błąd podczas pobierania danych.");
        }
    })
    .WithName("GetAllSensorsInfo")
    .WithOpenApi();


var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
    {
        var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
            .ToArray();
        return forecast;
    })
    .WithName("GetWeatherForecast")
    .WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

