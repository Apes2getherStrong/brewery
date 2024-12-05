import random
from abc import abstractmethod, ABC
from datetime import datetime
import uuid
import orjson

class Sensor(ABC):
    NAME: str
    _id_counter = 0

    def __init__(self):
        Sensor._id_counter += 1
        self.sensor_nr = Sensor._id_counter

    @abstractmethod
    def generate_data(self, value=None):
        pass
    
    def __str__(self):
        return f"ID: {self.sensor_nr} NAME: {self.NAME}"

# Define four different sensors for beer types
class TemperatureSensor(Sensor):
    NAME = "TEMPERATURE"

    def generate_data(self, value = None):
        if value == None:
            value = random.uniform(-10, 40)
        return orjson.dumps({
            "id": str(uuid.uuid4()),
            "sensorType": self.NAME,
            "sensorNr": self.sensor_nr,
            "value": round(value, 2),
            "dateTime": datetime.now().isoformat()
        })

class AlcoholContentSensor(Sensor):
    NAME = "ALCOHOL_CONTENT_PERCENT"

    def generate_data(self, value = None):
        if value == None:
            value = random.uniform(0, 15)
        return orjson.dumps({
            "id": str(uuid.uuid4()),
            "sensorType": self.NAME,
            "sensorNr": self.sensor_nr,
            "value": round(value, 2),
            "dateTime": datetime.now().isoformat()
        })

class PressureSensor(Sensor):
    NAME = "PRESSURE"

    def generate_data(self, value = None):
        if value == None:
            value = random.uniform(1, 5)  # Pressure in bar
        return orjson.dumps({
            "id": str(uuid.uuid4()),
            "sensorType": self.NAME,
            "sensorNr": self.sensor_nr,
            "value": round(value, 2),
            "dateTime": datetime.now().isoformat()
        })

class PHSensor(Sensor):
    NAME = "PH"

    def generate_data(self, value = None):
        if value == None:
            value = random.uniform(3, 8)
        return orjson.dumps({
            "id": str(uuid.uuid4()),
            "sensorType": self.NAME,
            "sensorNr": self.sensor_nr,
            "value": round(value, 2),
            "dateTime": datetime.now().isoformat()
        })
