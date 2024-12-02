import random
from abc import abstractmethod, ABC


class Sensor(ABC):
    NAME: str
    UNIT: str
    
    def __init__(self, x: float, y: float, z: float):
        self.x = x
        self.y = y
        self.z = z

    @abstractmethod
    def generate_data(self):
        pass


class TemperatureSensor(Sensor):
    __id_counter = 0
    NAME = "Temperature"
    UNIT= "Celsius"

    def __init__(self, x: float, y: float, z: float):
        super().__init__(x, y, z)
        TemperatureSensor.__id_counter += 1
        self.id = TemperatureSensor.__id_counter


    def generate_data(self):
        temp_base = 22
        temperature_variation = random.uniform(-5, 5)
        location_factor = (self.x + self.y + self.z) % 5
        temperature = temp_base + temperature_variation + location_factor
        return {"name": self.NAME, "id": self.id, "location": (self.x, self.y, self.z), "value": temperature, "unit": self.UNIT}


class HumiditySensor(Sensor):
    ___id_counter = 0
    NAME = "Humidity"
    UNIT= "Percent"

    def __init__(self, x: float, y: float, z: float):
        super().__init__(x, y, z)
        HumiditySensor.___id_counter += 1
        self.id = HumiditySensor.___id_counter


    def generate_data(self):
        humidity_base = 50
        humidity_variation = random.uniform(-10, 10)
        humidity = humidity_base + humidity_variation + (self.z % 10)
        return {"name": self.NAME, "id": self.id, "location": (self.x, self.y, self.z), "value": humidity, "unit": self.UNIT}


class PressureSensor(Sensor):
    __id_counter = 0
    NAME = "Pressure"
    UNIT= "hPa"
    
    def __init__(self, x: float, y: float, z: float):
        super().__init__(x, y, z)
        PressureSensor.__id_counter += 1
        self.id = PressureSensor.__id_counter

    

    def generate_data(self):
        pressure_base = 1013
        pressure_variation = random.uniform(-10, 10)
        pressure = pressure_base + pressure_variation - (self.z * 0.1)
        return {"name": self.NAME, "id": self.id, "location": (self.x, self.y, self.z), "value": pressure, "unit": self.UNIT}


class MotionSensor(Sensor):
    __id_counter = 0
    NAME = "Motion"
    UNIT= ""

    def __init__(self, x: float, y: float, z: float):
        super().__init__(x, y, z)
        MotionSensor.__id_counter += 1
        self.id = MotionSensor.__id_counter


    def generate_data(self):
        motion_detected = random.choice([True, False])
        return {"name": self.NAME, "id": self.id, "location": (self.x, self.y, self.z), "value": motion_detected, "unit": self.UNIT}
