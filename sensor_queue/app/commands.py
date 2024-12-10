import time

def generate_data(sensors, mqtt_client):
    """Continuously generate data for each sensor and publish it."""
    try:
        while True:
            for sensor_id, sensor in enumerate(sensors):
                data = sensor.generate_data()
                topic = sensor.NAME
                mqtt_client.publish(topic, data)
                time.sleep(0.25)
            # time.sleep(2)
    except KeyboardInterrupt:
        print("\nData generation interrupted.")


def generate_multiple_times(sensors, mqtt_client, count):
    """Generate data a specific number of times for each sensor."""
    try:
        for _ in range(count):
            for sensor_id, sensor in enumerate(sensors):
                data = sensor.generate_data()
                topic = sensor.NAME
                mqtt_client.publish(topic, data)
                time.sleep(0.25)
            # time.sleep(2)  
        print("finished")
    except KeyboardInterrupt:
        print("\nData generation interrupted.")


def write_to_sensor(sensors, mqtt_client, sensor_id, value):
    """Write a specific value to a sensor."""
    try:
        sensor = sensors[sensor_id+1]
        data = sensor.generate_data(float(value))
        topic = sensor.NAME
        mqtt_client.publish(topic,data)
    except IndexError:
        print(f"Error: Sensor with ID {sensor_id} does not exist.")
        
def get_all_sensors(sensors):
    for sensor in sensors:
        print(sensor)