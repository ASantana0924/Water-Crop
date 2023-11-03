#!/usr/bin/env python3

import socket
import sys
import json
import time
from time import sleep
from struct import unpack

# Create a UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Bind the socket to the port
host, port = '10.192.221.106', 8000
server_address = (host, port)

print(f'Starting UDP server on {host} port {port}')
sock.bind(server_address)

while True:
    # Wait for message
    message, address = sock.recvfrom(4096)

    print(f'Received {len(message)} bytes:')
    waterLevel, moistureLevel = unpack('2f', message)

    data = {
        "waterLevel": waterLevel,
        "moistureLevel": moistureLevel
    }

    # Convert the Python object to a JSON string
    json_string = json.dumps(data)

    # Write the JSON string to a file
    with open("data.json", "w") as f:
        f.write(json_string)