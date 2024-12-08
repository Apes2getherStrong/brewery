# Use the official Python image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

COPY /app . 

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint to the shell script
ENTRYPOINT ["/entrypoint.sh"]