using System;
using System.Linq;
using brewery_backend.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<MongoDbService>();
builder.Services.AddSingleton<MqttService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var mongoDbService = app.Services.GetRequiredService<MongoDbService>();

if (await mongoDbService.TestConnectionAsync())
{
    Console.WriteLine("Połączenie z bazą danych MongoDB zostało nawiązane pomyślnie!");
    
    var sensorData = await mongoDbService.GetAllSensorDataAsync();
    foreach (var data in sensorData)
    {
        Console.WriteLine($"Topic: {data.Topic}, Value: {data.Value}, Timestamp: {data.Timestamp}");
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

