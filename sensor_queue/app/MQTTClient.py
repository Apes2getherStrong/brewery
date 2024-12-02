import paho.mqtt.client as mqtt


class MQTTClient:
    def __init__(self, broker, port=1883, keepalive=60):
        self.client = mqtt.Client()
        self.broker = broker
        self.port = port
        self.keepalive = keepalive

    def connect(self):
        self.client.connect(self.broker, self.port, self.keepalive)
        print(f"Connected to MQTT Broker at {self.broker}")

    def publish(self, topic, message):
        self.client.publish(topic, message)
        print(f"Message published to {topic}: {message}")

    def loop(self):
        self.client.loop_start()
