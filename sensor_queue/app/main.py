from MQTTClient import MQTTClient
from sensor import AlcoholContentSensor, PHSensor, PressureSensor, TemperatureSensor
import os
import argparse

from commands import generate_data, generate_multiple_times, get_all_sensors, write_to_sensor

def initialize_sensors():
    sensors = []
    # Define the sensor types and their counts
    sensor_types = [
        (TemperatureSensor, 4),
        (AlcoholContentSensor, 4),
        (PressureSensor, 4),
        (PHSensor, 4)
    ]
    for sensor_class, count in sensor_types:
        sensors.extend(sensor_class() for _ in range(count))
    return sensors

def handle_command(mqtt_client, sensors, command, *args):
    if command == "generate":
        generate_data(sensors, mqtt_client)

    elif command == "generate_int":
        try:
            count = int(args[0])
            generate_multiple_times(sensors, mqtt_client, count)
        except ValueError:
            print("Error: Invalid number of iterations.")
    elif command == "write":
        try:
            sensor_id = int(args[0])
            value = args[1]
            write_to_sensor(sensors, mqtt_client, sensor_id, value)
        except (ValueError, IndexError):
            print("Error: Invalid arguments for 'write' command.")
    elif command=="get_all_sensors":
        get_all_sensors(sensors)
    else:
        print(f"Unknown command: {command}")

def main():
    mqtt_client = MQTTClient(os.getenv('MQTT_BROKER'))
    mqtt_client.connect()
    mqtt_client.loop() 

    sensors = initialize_sensors()

    parser = argparse.ArgumentParser(description="Process commands for sensor data generation and control.")
    parser.add_argument("command", help="The command to execute (e.g., generate, generate_int, write)")
    parser.add_argument("args", nargs="*", help="Arguments for the command")

    args = parser.parse_args()

    try:
        handle_command(mqtt_client, sensors, args.command, *args.args)
    finally:
        mqtt_client.stop()
        mqtt_client.disconnect()
    

if __name__ == "__main__":
    main()