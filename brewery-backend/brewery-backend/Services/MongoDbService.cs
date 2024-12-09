namespace brewery_backend.Services;

using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

using brewery_backend.Models;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoDB");
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(configuration["DatabaseName"]);
    }
    
    public IMongoCollection<SensorData> SensorDataCollection =>
        _database.GetCollection<SensorData>("SensorData");

    public async Task<bool> TestConnectionAsync()
    {
        try
        {
            var result = await _database.ListCollectionsAsync();
            return result != null;
        }
        catch
        {
            return false;
        }
    }
    public async Task<List<SensorData>> GetAllSensorDataAsync()
    {
        return await SensorDataCollection.Find(_ => true).ToListAsync();
    }
    
    public async Task<List<SensorData>> GetSensorsDataInDateRangeAsync(DateTime start, DateTime end)
    {
        return await SensorDataCollection
            .Find(data => data.Date >= start && data.Date <= end)
            .ToListAsync();
    }

    public async Task<List<SensorData>> GetLatestSensorDataAsync(int sensorNr, int howManyRecords)
    {
        return await SensorDataCollection
            .Find(data => data.SensorNr == sensorNr)
            .SortByDescending(data => data.Date)
            .Limit(howManyRecords)
            .ToListAsync();
    }
    
    public async Task<double> GetSensorLatestAvgAsync(int sensorNr, int howManyRecords)
    {
        var latestRecords = await GetLatestSensorDataAsync(sensorNr, howManyRecords);
        return latestRecords
            .Where(record => double.TryParse(record.Value, out _))
            .Average(record => double.Parse(record.Value));
    }
}