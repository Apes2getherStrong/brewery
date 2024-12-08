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
                string topic = e.ApplicationMessage.Topic;

                // Tworzenie obiektu SensorData
                var sensorData = new SensorData
                {
                    Topic = topic,
                    Value = message,
                    Timestamp = DateTime.UtcNow
                };

                // Zapisz dane do bazy danych
                await _mongoDbService.SensorDataCollection.InsertOneAsync(sensorData);

                // Obsługa różnych tematów
                switch (topic)
                {
                    case "Temperature":
                        Console.WriteLine($"Otrzymano wiadomość z TEMPERATURY: {message}");
                        break;
                    case "Humidity":
                        Console.WriteLine($"Otrzymano wiadomość z WILGOTNOŚCI: {message}");
                        break;
                    case "Pressure":
                        Console.WriteLine($"Otrzymano wiadomość z CIŚNIENIA: {message}");
                        break;
                    case "Motion":
                        Console.WriteLine($"Otrzymano wiadomość z RUCHU: {message}");
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
            await _mqttClient.SubscribeAsync("Temperature");
            await _mqttClient.SubscribeAsync("Humidity");
            await _mqttClient.SubscribeAsync("Pressure");
            await _mqttClient.SubscribeAsync("Motion");

            Console.WriteLine("Subskrybowano tematy: Temperature, Humidity, Pressure, Motion");
        }

        public async Task StopListeningAsync()
        {
            await _mqttClient.DisconnectAsync();
            Console.WriteLine("Rozłączono z brokerem MQTT");
        }
    }
