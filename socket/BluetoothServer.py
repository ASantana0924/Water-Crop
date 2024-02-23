import socket
import sys

def main():
    # Establish socket connection
    server = socket.socket(socket.AF_BLUETOOTH, socket.SOCK_STREAM, socket.BTPROTO_RFCOMM)
    # RP MAC Address
    # server.bind(("b8:27:eb:53:be:4e", 4))
    server.bind(("84:5C:F3:7F:34:6E", 4))
    server.listen(1)

    client, addr = server.accept()

    # Handle command line arguments
    message = ""
    n = len(sys.argv)
    for i in range(1, n):
        message += sys.argv[i] + " "

    try:
        data = client.recv(1024)
        if not data:
            # Figure out how to throw error
            client.close()
            server.close()
        print(f"Message: {data.decode('utf-8')}")
        # message = "'User ID', 'Network Name', 'Network Password'"
        client.send(message.encode('utf-8'))
    except OSError as e:
        pass

    client.close()
    server.close()

if __name__ == "__main__":
    main()