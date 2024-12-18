# import json
# import random
# import uuid
# from datetime import datetime, timedelta
# from flask import Flask, jsonify
# from flask_socketio import SocketIO
# from flask_cors import CORS
# import threading

# app = Flask(__name__)
# CORS(app)
# socketio = SocketIO(app, cors_allowed_origins="*")

# def generate_robot_data(num_robots=10):
#     """Generate mock robot data"""
#     robots = []
#     for _ in range(num_robots):
#         robot = {
#             "Robot ID": str(uuid.uuid4()),
#             "Online/Offline": random.choice([True, False]),
#             "Battery Percentage": random.randint(10, 100),
#             "CPU Usage": random.randint(1, 100),
#             "RAM Consumption": random.randint(1000, 8000),
#             "Last Updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#             "Location Coordinates": [
#                 round(random.uniform(-90, 90), 6),
#                 round(random.uniform(-180, 180), 6)
#             ]
#         }
#         robots.append(robot)
#     return robots

# # Global variable to store current robot data
# current_robots = generate_robot_data()

# @app.route('/robots', methods=['GET'])
# def get_robots():
#     """REST endpoint to get current robot data"""
#     return jsonify(current_robots)

# def update_robot_data():
#     """Periodically update robot data and emit via WebSocket"""
#     global current_robots
#     while True:
#         # Update existing robots
#         for robot in current_robots:
#             # Randomly update status
#             robot['Online/Offline'] = random.choice([True, False])
#             robot['Battery Percentage'] = max(0, min(100, robot['Battery Percentage'] + random.randint(-10, 10)))
#             robot['CPU Usage'] = random.randint(1, 100)
#             robot['RAM Consumption'] = random.randint(1000, 8000)
#             robot['Last Updated'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#             robot['Location Coordinates'] = [
#                 round(robot['Location Coordinates'][0] + random.uniform(-1, 1), 6),
#                 round(robot['Location Coordinates'][1] + random.uniform(-1, 1), 6)
#             ]
        
#         # Emit updated data via WebSocket
#         socketio.emit('robot_update', current_robots)
        
#         # Wait for 5 seconds
#         socketio.sleep(5)

# @socketio.on('connect')
# def handle_connect():
#     """Handle new WebSocket connection"""
#     print('Client connected')
#     # Send initial robot data
#     socketio.emit('robot_update', current_robots)

# @socketio.on('disconnect')
# def handle_disconnect():
#     """Handle WebSocket disconnection"""
#     print('Client disconnected')

# if __name__ == '__main__':
#     # Start the background thread for updating robot data
#     socketio.start_background_task(update_robot_data)
    
#     # Run the Flask-SocketIO app
#     socketio.run(app, debug=True, port=5000)

# # Requirements for running:
# # pip install flask flask-socketio flask-cors

import json
import random
from datetime import datetime
from flask import Flask, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Path to the JSON file
JSON_FILE_PATH = 'fake_robot_data.json'

def load_robot_data():
    """Load robot data from JSON file"""
    try:
        with open(JSON_FILE_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {JSON_FILE_PATH} not found!")
        return []
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {JSON_FILE_PATH}")
        return []

def update_robot_data(robots):
    """Simulate slight variations in robot data"""
    for robot in robots:
        # Randomly adjust some parameters
        robot['Battery Percentage'] = max(0, min(100, 
            robot['Battery Percentage'] + random.randint(-5, 5)
        ))
        robot['CPU Usage'] = max(0, min(100, 
            robot['CPU Usage'] + random.randint(-10, 10)
        ))
        
        # Simulate small location changes
        robot['Location Coordinates'][0] += random.uniform(-0.5, 0.5)
        robot['Location Coordinates'][1] += random.uniform(-0.5, 0.5)
        
        # Randomly toggle online/offline status
        robot['Online/Offline'] = random.choice([
            robot['Online/Offline'], 
            not robot['Online/Offline']
        ])
        
        # Update timestamp
        robot['Last Updated'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return robots

@app.route('/robots', methods=['GET'])
def get_robots():
    """REST endpoint to get current robot data"""
    robots = load_robot_data()
    return jsonify(robots)

def broadcast_robot_data():
    """Periodically update and broadcast robot data"""
    while True:
        # Load original data
        robots = load_robot_data()
        
        # Apply simulated updates
        updated_robots = update_robot_data(robots)
        
        # Broadcast updated data via WebSocket
        socketio.emit('robot_update', updated_robots)
        
        # Wait for 5 seconds
        socketio.sleep(5)

@socketio.on('connect')
def handle_connect():
    """Handle new WebSocket connection"""
    print('Client connected')
    # Load and send initial robot data
    robots = load_robot_data()
    socketio.emit('robot_update', robots)

@socketio.on('disconnect')
def handle_disconnect():
    """Handle WebSocket disconnection"""
    print('Client disconnected')

if __name__ == '__main__':
    # Ensure JSON file exists in the same directory
    if not os.path.exists(JSON_FILE_PATH):
        print(f"Error: {JSON_FILE_PATH} must be in the same directory as this script")
        exit(1)
    
    # Start the background task for updating robot data
    socketio.start_background_task(broadcast_robot_data)
    
    # Run the Flask-SocketIO app
    socketio.run(app, debug=True, port=5000)
# # Requirements:
# # pip install flask flask-socketio flask-cors

# import os
# from flask import Flask, jsonify
# from flask_socketio import SocketIO
# from flask_cors import CORS
# import json
# import random
# from datetime import datetime
# from gevent.pywsgi import WSGIServer
# from gevent_websocket.handler import WebSocketHandler

# app = Flask(__name__)
# CORS(app)
# socketio = SocketIO(app, 
#     cors_allowed_origins="*", 
#     async_mode='gevent'
# )

# # Path to the JSON file
# JSON_FILE_PATH = 'fake_robot_data.json'

# def load_robot_data():
#     """Load robot data from JSON file"""
#     try:
#         with open(JSON_FILE_PATH, 'r') as f:
#             return json.load(f)
#     except FileNotFoundError:
#         print(f"Error: {JSON_FILE_PATH} not found!")
#         return []
#     except json.JSONDecodeError:
#         print(f"Error: Invalid JSON in {JSON_FILE_PATH}")
#         return []

# def update_robot_data(robots):
#     """Simulate slight variations in robot data"""
#     for robot in robots:
#         # Randomly adjust some parameters
#         robot['Battery Percentage'] = max(0, min(100, 
#             robot['Battery Percentage'] + random.randint(-5, 5)
#         ))
#         robot['CPU Usage'] = max(0, min(100, 
#             robot['CPU Usage'] + random.randint(-10, 10)
#         ))
        
#         # Simulate small location changes
#         robot['Location Coordinates'][0] += random.uniform(-0.5, 0.5)
#         robot['Location Coordinates'][1] += random.uniform(-0.5, 0.5)
        
#         # Randomly toggle online/offline status
#         robot['Online/Offline'] = random.choice([
#             robot['Online/Offline'], 
#             not robot['Online/Offline']
#         ])
        
#         # Update timestamp
#         robot['Last Updated'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
#     return robots

# @app.route('/robots', methods=['GET'])
# def get_robots():
#     """REST endpoint to get current robot data"""
#     robots = load_robot_data()
#     return jsonify(robots)

# def broadcast_robot_data():
#     """Periodically update and broadcast robot data"""
#     while True:
#         # Load original data
#         robots = load_robot_data()
        
#         # Apply simulated updates
#         updated_robots = update_robot_data(robots)
        
#         # Broadcast updated data via WebSocket
#         socketio.emit('robot_update', updated_robots)
        
#         # Wait for 5 seconds
#         socketio.sleep(5)

# @socketio.on('connect')
# def handle_connect():
#     """Handle new WebSocket connection"""
#     print('Client connected')
#     # Load and send initial robot data
#     robots = load_robot_data()
#     socketio.emit('robot_update', robots)

# @socketio.on('disconnect')
# def handle_disconnect():
#     """Handle WebSocket disconnection"""
#     print('Client disconnected')

# if __name__ == '__main__':
#     # For production deployment
#     port = int(os.environ.get('PORT', 5000))
#     print(f'Server starting on port {port}')
    
#     # Start the background task for updating robot data
#     socketio.start_background_task(broadcast_robot_data)
    
#     # Use gevent WSGI server
#     http_server = WSGIServer(('', port), app, handler_class=WebSocketHandler)
#     http_server.serve_forever()