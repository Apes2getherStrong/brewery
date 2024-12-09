using System.Text.Json.Nodes;
using brewery_backend.Models;
using MQTTnet.Client.Options;

namespace brewery_backend.Services;

using Microsoft.Extensions.Configuration;
using MQTTnet.Client.Options;
using MQTTnet;
using MQTTnet.Client;
using System;
using System.Text;
using System.Threading.Tasks;

public class MqttService
{
    private readonly IMqttClient _mqttClient;
    private readonly string _brokerAddress;
    private readonly int _brokerPort;
    private readonly MongoDbService _mongoDbService;

    public MqttService(IConfiguration configuration, MongoDbService mongoDbService)
    {
        var mqttSettings = configuration.GetSection("MqttSettings");
        _brokerAddress = mqttSettings.GetValue<string>("Host");
        _brokerPort = mqttSettings.GetValue<int>("Port");

        _mongoDbService = mongoDbService;

        var factory = new MqttFactory();
        _mqttClient = factory.CreateMqttClient();
    }

    public async Task StartListeningAsync()
    {
        // Obsługa otrzymanych wiadomości
        _mqttClient.UseApplicationMessageReceivedHandler(async e =>
        {
            var message = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
            var jsonObject = JsonNode.Parse(message)?.AsObject();

            string topic = e.ApplicationMessage.Topic;

            // Tworzenie obiektu SensorData
            var sensorData = new SensorData
            {
                Id = jsonObject?["id"]?.ToString(),
                SensorType = jsonObject?["sensorType"]?.ToString(),
                SensorNr = jsonObject?["sensorNr"]?.GetValue<int>() ?? 0,
                Value = jsonObject?["value"]?.ToString(),
                // Value = Math.Abs(jsonObject?["value"]?.GetValue<double>() ?? 0).ToString(),
                Date = jsonObject?["dateTime"]?.GetValue<DateTime>() ?? DateTime.MinValue,
            };

            try
            {
                // Zapisz dane do bazy danych
                await _mongoDbService.SensorDataCollection.InsertOneAsync(sensorData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Wystąpił błąd podczas zapisu do MongoDB: {ex.Message}");
            }

            // Obsługa różnych tematów
            switch (topic)
            {
                case "TEMPERATURE":
                    Console.WriteLine($"Otrzymano wiadomość z TEMPERATURY: {message}");
                    break;
                case "ALCOHOL_CONTENT_PERCENT":
                    Console.WriteLine($"Otrzymano wiadomość z ALCOHOL_CONTENT_PERCENT: {message}");
                    break;
                case "PRESSURE":
                    Console.WriteLine($"Otrzymano wiadomość z PRESSURE: {message}");
                    break;
                case "PH":
                    Console.WriteLine($"Otrzymano wiadomość z PH: {message}");
                    break;
                default:
                    Console.WriteLine($"Otrzymano wiadomość z nieznanego tematu: {message}");
                    break;
            }
        });

        var options = new MqttClientOptionsBuilder()
            .WithTcpServer(_brokerAddress, _brokerPort)
            .Build();

        await _mqttClient.ConnectAsync(options);
        Console.WriteLine($"Połączono z brokerem MQTT na {_brokerAddress}:{_brokerPort}");

        // Subskrypcja tematów
        await _mqttClient.SubscribeAsync("TEMPERATURE");
        await _mqttClient.SubscribeAsync("ALCOHOL_CONTENT_PERCENT");
        await _mqttClient.SubscribeAsync("PRESSURE");
        await _mqttClient.SubscribeAsync("PH");

        Console.WriteLine("Subskrybowano tematy: Temperature, ALCOHOL_CONTENT_PERCENT, Pressure, PH");
    }

    public async Task StopListeningAsync()
    {
        await _mqttClient.DisconnectAsync();
        Console.WriteLine("Rozłączono z brokerem MQTT");
    }
}