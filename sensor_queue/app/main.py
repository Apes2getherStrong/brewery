import random
import time
from MQTTClient import MQTTClient
from sensor import HumiditySensor, MotionSensor, PressureSensor, TemperatureSensor
import os

print(os.getenv('MQTT_BROKER'))

mqtt_client = MQTTClient(os.getenv('MQTT_BROKER'))  # Adjust broker address if needed
mqtt_client.connect()
mqtt_client.loop()
# Create Sensors
temp_sensors = [TemperatureSensor(random.uniform(0, 10), random.uniform(0, 10), random.uniform(0, 10)) for i in range(4)]
humidity_sensors = [HumiditySensor(random.uniform(0, 10), random.uniform(0, 10), random.uniform(0, 10)) for i in range(4)]
pressure_sensors = [PressureSensor(random.uniform(0, 10), random.uniform(0, 10), random.uniform(0, 10)) for i in range(4)]
motion_sensors = [MotionSensor(random.uniform(0, 10), random.uniform(0, 10), random.uniform(0, 10)) for i in range(4)]

try:
    while True:
        for sensor_list in [temp_sensors, humidity_sensors, pressure_sensors, motion_sensors]:
            for sensor in sensor_list:
                data = sensor.generate_data()
                topic = sensor.NAME
                mqtt_client.publish(topic, str(data))
        time.sleep(5)
except KeyboardInterrupt:
    print("Exiting...")
    mqtt_client.client.disconnect()
