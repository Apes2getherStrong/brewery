namespace brewery_backend.Models;


using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class SensorData
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } 
    public string Topic { get; set; } 
    public string Value { get; set; } 
    public DateTime Timestamp { get; set; } 
    public int SensorNr { get; set; }
}
