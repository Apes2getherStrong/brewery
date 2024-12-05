#!/bin/bash
python main.py generate_int 10 &  # Run the generate command in the background
  GENERATE_PID=$!           # Capture the PID of the generate process
  echo "Generate process started with PID: $GENERATE_PID"
  wait $GENERATE_PID

# keeps the container running even when process finishes
tail -f /dev/null
