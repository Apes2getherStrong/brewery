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

    public MqttService(IConfiguration configuration)
    {
        var mqttSettings = configuration.GetSection("MqttSettings");
        _brokerAddress = mqttSettings.GetValue<string>("Host");
        _brokerPort = mqttSettings.GetValue<int>("Port");

        var factory = new MqttFactory();
        _mqttClient = factory.CreateMqttClient();
    }

    public async Task StartListeningAsync()
    {
        _mqttClient.UseApplicationMessageReceivedHandler(e =>
        {
            var message = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
            Console.WriteLine($"Otrzymano wiadomość: {message} na temacie: {e.ApplicationMessage.Topic}");
        });

        var options = new MqttClientOptionsBuilder()
            .WithTcpServer(_brokerAddress, _brokerPort)
            .Build();

        await _mqttClient.ConnectAsync(options);
        Console.WriteLine($"Połączono z brokerem MQTT na {_brokerAddress}:{_brokerPort}");

        await _mqttClient.SubscribeAsync("Temperature"); // Subskrybuj temat, np. Temperature
        Console.WriteLine("Subskrybowano temat: Temperature");
    }

    public async Task StopListeningAsync()
    {
        await _mqttClient.DisconnectAsync();
        Console.WriteLine("Rozłączono z brokerem MQTT");
    }
}