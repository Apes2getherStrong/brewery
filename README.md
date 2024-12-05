# Sensors
Jak odpalasz dockera wysle 10 razy dane i przestanie

Zeby odpalic znowu

```bash
docker exec sensors -it /bin/bash
```
albo wejdz w DockerDesktop na zakładke exec i daj

```bash
python main.py generate #generuje dopóki nie zrobisz ctrl C
python main.py generate_int <N> #generuje N razy
python main.py get_all_sensors # zwraca liste wszystkich sensorow z id
python main.py write <ID> <N> # wysyla wartosc N z sensora o id == ID
```