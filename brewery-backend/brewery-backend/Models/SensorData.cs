namespace brewery_backend.Models;


using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class SensorData
{
    [BsonId]
    public string Id { get; set; } 
    public string SensorType { get; set; } 
    public int SensorNr { get; set; }
    public string Value { get; set; } 
    public DateTime Date { get; set; } 
    
    public override string ToString()
    {
        return $"Id: {Id}, SensorType: {SensorType}, SensorNr: {SensorNr}, Value: {Value}, Date: {Date}";
    }
}
