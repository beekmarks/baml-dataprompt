#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Warning: .env file not found. Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Error: OPENAI_API_KEY is not set in .env file"
    exit 1
fi

# Function to kill process on port 3000
kill_port_3000() {
    echo "Checking for process on port 3000..."
    local pid=$(lsof -ti:3000)
    if [ ! -z "$pid" ]; then
        echo "Found process $pid using port 3000. Killing it..."
        kill $pid
        sleep 1
    else
        echo "No process found on port 3000"
    fi
}

# Kill any existing process on port 3000
kill_port_3000

# Start the server
echo "Starting server on port 3000..."
npm start
