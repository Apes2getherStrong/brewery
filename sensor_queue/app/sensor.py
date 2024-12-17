import random
from abc import abstractmethod, ABC
from datetime import datetime
import uuid
import orjson


class Sensor(ABC):
    NAME: str
    _id_counter = 0

    def __init__(self, min_value, max_value, generation_rate):
        Sensor._id_counter += 1
        self.sensor_nr = Sensor._id_counter
        self.min_value = min_value
        self.max_value = max_value
        self.generation_rate = generation_rate  # times per minute

    @abstractmethod
    def generate_data(self, value=None):
        pass
    
    def __str__(self):
        return f"ID: {self.sensor_nr} NAME: {self.NAME} Min: {self.min_value} Max: {self.max_value} Rate: {self.generation_rate} per minute"


class TemperatureSensor(Sensor):
    NAME = "TEMPERATURE"

    def generate_data(self, value=None):
        if value is None:
            value = random.uniform(self.min_value, self.max_value)
        return orjson.dumps({
            "id": str(uuid.uuid4()),
            "sensorType": self.NAME,
            "sensorNr": self.sensor_nr,
            "value": round(value, 2),
            "dateTime": datetime.now().isoformat()
        })


class AlcoholContentSensor(Sensor):
    NAME = "ALCOHOL_CONTENT_PERCENT"

    def generate_data(self, value=None):
        if value is None:
            value = random.uniform(self.min_value, self.max_value)
        return orjson.dumps({
            "id": str(uuid.uuid4()),
            "sensorType": self.NAME,
            "sensorNr": self.sensor_nr,
            "value": round(value, 2),
            "dateTime": datetime.now().isoformat()
        })


class PressureSensor(Sensor):
    NAME = "PRESSURE"

    def generate_data(self, value=None):
        if value is None:
            value = random.uniform(self.min_value, self.max_value)
        return orjson.dumps({
            "id": str(uuid.uuid4()),
            "sensorType": self.NAME,
            "sensorNr": self.sensor_nr,
            "value": round(value, 2),
            "dateTime": datetime.now().isoformat()
        })


class PHSensor(Sensor):
    NAME = "PH"

    def generate_data(self, value=None):
        if value is None:
            value = random.uniform(self.min_value, self.max_value)
        return orjson.dumps({
            "id": str(uuid.uuid4()),
            "sensorType": self.NAME,
            "sensorNr": self.sensor_nr,
            "value": round(value, 2),
            "dateTime": datetime.now().isoformat()
        })