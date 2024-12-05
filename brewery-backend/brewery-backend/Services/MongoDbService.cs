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
        
        var testDocument = new SensorData
        {
            Topic = "Test",
            Value = "123",
            Timestamp = DateTime.UtcNow
        };

        SensorDataCollection.InsertOne(testDocument);
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

}
