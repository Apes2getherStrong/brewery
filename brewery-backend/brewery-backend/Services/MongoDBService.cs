namespace brewery_backend.Services;

using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoDB");
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(configuration["DatabaseName"]);
    }

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
}
