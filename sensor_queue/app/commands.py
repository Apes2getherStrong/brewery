import time
import threading

def generate_data_for_sensor(sensor, mqtt_client, stop_event):
    """Generate data for a specific sensor in a separate thread."""
    try:
        while not stop_event.is_set():  # Loop until stop_event is set
            data = sensor.generate_data()
            topic = sensor.NAME
            mqtt_client.publish(topic, data)
            time.sleep(60 / sensor.generation_rate)  # Sleep based on generation rate (times per minute)
    except Exception as e:
        print(f"Error in sensor {sensor.sensor_nr}: {e}")
    finally:
        print(f"Sensor {sensor.sensor_nr} stopped.")


def generate_data(sensors, mqtt_client):
    """Generate data for each sensor in a separate thread."""
    stop_event = threading.Event()  # Event to stop all threads gracefully
    threads = []

    try:
        # Start a separate thread for each sensor
        for sensor in sensors:
            thread = threading.Thread(target=generate_data_for_sensor, args=(sensor, mqtt_client, stop_event))
            threads.append(thread)
            thread.start()

        # Block the main thread and wait for keyboard interrupt
        while True:
            time.sleep(1)  # Sleep to keep the main thread alive
    except KeyboardInterrupt:
        print("\nData generation interrupted. Stopping all threads...")
        stop_event.set()  # Trigger all threads to stop gracefully

        # Wait for all threads to finish
        for thread in threads:
            thread.join()

    finally:
        print("All threads have been stopped.")

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
        sensor = sensors[sensor_id-1]
        data = sensor.generate_data(float(value))
        topic = sensor.NAME
        mqtt_client.publish(topic,data)
    except IndexError:
        print(f"Error: Sensor with ID {sensor_id} does not exist.")
        
def get_all_sensors(sensors):
    for sensor in sensors:
        print(sensor)