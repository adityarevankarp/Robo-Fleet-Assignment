// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import greenmarker from '../assets/pngegg.png'
// import redmarker from '../assets/redrobot.png'
// import orange from '../assets/orange.png'

// // Custom marker icons
// const onlineIcon = L.icon({
//   iconUrl: greenmarker,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const offlineIcon = L.icon({
//   iconUrl: redmarker,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const lowBatteryIcon = L.icon({
//   iconUrl: orange,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// function RobotDashboard() {
//   const [robots, setRobots] = useState([]);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     // Connect to WebSocket
//     const socket = io('http://localhost:5000');

//     // Listen for robot updates
//     socket.on('robot_update', (updatedRobots) => {
//       setRobots(updatedRobots);
//     });

//     // Cleanup on component unmount
//     return () => socket.disconnect();
//   }, []);

//   // Filter robots based on status
//   const filteredRobots = robots.filter(robot => {
//     if (filter === 'online') return robot['Online/Offline'] === true;
//     if (filter === 'offline') return robot['Online/Offline'] === false;
//     if (filter === 'low-battery') return robot['Battery Percentage'] < 20;
//     return true;
//   });

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
//         <h1 className="text-2xl font-bold mb-4">Robot Fleet Dashboard</h1>
        
//         {/* Filter Controls */}
//         <div className="mb-4">
//           <label className="block mb-2">Filter Robots:</label>
//           <select 
//             value={filter} 
//             onChange={(e) => setFilter(e.target.value)}
//             className="w-full p-2 border rounded"
//           >
//             <option value="all">All Robots</option>
//             <option value="online">Online Robots</option>
//             <option value="offline">Offline Robots</option>
//             <option value="low-battery">Low Battery Robots</option>
//           </select>
//         </div>

//         {/* Robot List */}
//         <div className="space-y-2">
//           {filteredRobots.map(robot => (
//             <div 
//               key={robot['Robot ID']} 
//               className={`p-3 rounded ${
//                 !robot['Online/Offline'] ? 'bg-red-100' : 
//                 robot['Battery Percentage'] < 20 ? 'bg-yellow-100' : 
//                 'bg-green-100'
//               }`}
//             >
//               <div className="font-semibold">Robot ID: {robot['Robot ID'].split('-')[0]}</div>
//               <div>Status: {robot['Online/Offline'] ? 'Online' : 'Offline'}</div>
//               <div>Battery: {robot['Battery Percentage']}%</div>
//               <div>CPU Usage: {robot['CPU Usage']}%</div>
//               <div>RAM: {robot['RAM Consumption']} MB</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Map View */}
//       <div className="w-3/4">
//         <MapContainer 
//           center={[0, 0]} 
//           zoom={3} 
//           className="h-full w-full"
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
          
//           {filteredRobots.map(robot => (
//             <Marker
//               key={robot['Robot ID']}
//               position={robot['Location Coordinates']}
//               icon={
//                 !robot['Online/Offline'] ? offlineIcon : 
//                 robot['Battery Percentage'] < 20 ? lowBatteryIcon : 
//                 onlineIcon
//               }
//             >
//               <Popup>
//                 <div>
//                   <strong>Robot ID:</strong> {robot['Robot ID']}<br/>
//                   <strong>Status:</strong> {robot['Online/Offline'] ? 'Online' : 'Offline'}<br/>
//                   <strong>Battery:</strong> {robot['Battery Percentage']}%<br/>
//                   <strong>CPU Usage:</strong> {robot['CPU Usage']}%<br/>
//                   <strong>RAM:</strong> {robot['RAM Consumption']} MB<br/>
//                   <strong>Last Updated:</strong> {robot['Last Updated']}
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default RobotDashboard;



// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// function RobotDashboard() {
//   const [robots, setRobots] = useState([]);
//   const [filters, setFilters] = useState({
//     online: true,
//     offline: true,
//     lowBattery: true
//   });

//   useEffect(() => {
//     const socket = io('http://localhost:5000');
//     socket.on('robot_update', (updatedRobots) => {
//       setRobots(updatedRobots);
//     });
//     return () => socket.disconnect();
//   }, []);

//   // Filter robots based on status
//   const filteredRobots = robots.filter(robot => {
//     const isOnline = robot['Online/Offline'];
//     const isLowBattery = robot['Battery Percentage'] < 20;

//     if (filters.online && isOnline && !isLowBattery) return true;
//     if (filters.offline && !isOnline) return true;
//     if (filters.lowBattery && isOnline && isLowBattery) return true;

//     return false;
//   });

//   // Toggle filter function
//   const toggleFilter = (filterName) => {
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [filterName]: !prevFilters[filterName]
//     }));
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar with Filters */}
//       <div className="w-1/4 bg-gray-100 p-4">
//         <h2 className="text-xl font-bold mb-4">Robot Filters</h2>
        
//         <div className="space-y-2">
//           {/* Online Robots Filter */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="onlineFilter"
//               checked={filters.online}
//               onChange={() => toggleFilter('online')}
//               className="mr-2"
//             />
//             <label 
//               htmlFor="onlineFilter" 
//               className="flex items-center"
//             >
//               <span className="w-4 h-4 mr-2 bg-green-500 rounded-full"></span>
//               Online Robots
//             </label>
//           </div>

//           {/* Offline Robots Filter */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="offlineFilter"
//               checked={filters.offline}
//               onChange={() => toggleFilter('offline')}
//               className="mr-2"
//             />
//             <label 
//               htmlFor="offlineFilter" 
//               className="flex items-center"
//             >
//               <span className="w-4 h-4 mr-2 bg-red-500 rounded-full"></span>
//               Offline Robots
//             </label>
//           </div>

//           {/* Low Battery Robots Filter */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="lowBatteryFilter"
//               checked={filters.lowBattery}
//               onChange={() => toggleFilter('lowBattery')}
//               className="mr-2"
//             />
//             <label 
//               htmlFor="lowBatteryFilter" 
//               className="flex items-center"
//             >
//               <span className="w-4 h-4 mr-2 bg-orange-500 rounded-full"></span>
//               Low Battery Robots
//             </label>
//           </div>
//         </div>

//         {/* Robot Count */}
//         <div className="mt-4 text-sm text-gray-600">
//           Showing {filteredRobots.length} of {robots.length} robots
//         </div>
//       </div>

//       {/* Map View */}
//       <div className="w-3/4">
//         <MapContainer 
//           center={[0, 0]} 
//           zoom={3} 
//           className="h-full w-full"
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; OpenStreetMap contributors'
//           />
          
//           {filteredRobots.map(robot => (
//             <Marker
//               key={robot['Robot ID']}
//               position={robot['Location Coordinates']}
//             >
//               <Popup>
//                 <div>
//                   <strong>Robot ID:</strong> {robot['Robot ID']}<br/>
//                   <strong>Status:</strong> {robot['Online/Offline'] ? 'Online' : 'Offline'}<br/>
//                   <strong>Battery:</strong> {robot['Battery Percentage']}%<br/>
//                   <strong>CPU Usage:</strong> {robot['CPU Usage']}%
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default RobotDashboard;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import greenmarker from '../assets/pngegg.png';
import redmarker from '../assets/redrobot.png';
import orange from '../assets/orange.png';

// Custom marker icons
const onlineIcon = L.icon({
  iconUrl: greenmarker,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const offlineIcon = L.icon({
  iconUrl: redmarker,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const lowBatteryIcon = L.icon({
  iconUrl: orange,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RobotDashboard() {
  const [robots, setRobots] = useState([]);
  const [filters, setFilters] = useState({
    online: true,
    offline: true,
    lowBattery: true
  });

  useEffect(() => {
    // Connect to WebSocket
    const socket = io('http://localhost:5000');

    // Listen for robot updates
    socket.on('robot_update', (updatedRobots) => {
      setRobots(updatedRobots);
    });

    // Cleanup on component unmount
    return () => socket.disconnect();
  }, []);

  // Filter robots based on status
  const filteredRobots = robots.filter(robot => {
    const isOnline = robot['Online/Offline'];
    const isLowBattery = robot['Battery Percentage'] < 20;

    if (filters.online && isOnline && !isLowBattery) return true;
    if (filters.offline && !isOnline) return true;
    if (filters.lowBattery && isOnline && isLowBattery) return true;

    return false;
  });

  // Toggle filter function
  const toggleFilter = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName]
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Robot Fleet Dashboard</h1>
        
        {/* Filter Controls */}
        <div className="space-y-2">
          {/* Online Robots Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="onlineFilter"
              checked={filters.online}
              onChange={() => toggleFilter('online')}
              className="mr-2"
            />
            <label 
              htmlFor="onlineFilter" 
              className="flex items-center"
            >
              <span className="w-4 h-4 mr-2 bg-green-500 rounded-full"></span>
              Online Robots
            </label>
          </div>

          {/* Offline Robots Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="offlineFilter"
              checked={filters.offline}
              onChange={() => toggleFilter('offline')}
              className="mr-2"
            />
            <label 
              htmlFor="offlineFilter" 
              className="flex items-center"
            >
              <span className="w-4 h-4 mr-2 bg-red-500 rounded-full"></span>
              Offline Robots
            </label>
          </div>

          {/* Low Battery Robots Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="lowBatteryFilter"
              checked={filters.lowBattery}
              onChange={() => toggleFilter('lowBattery')}
              className="mr-2"
            />
            <label 
              htmlFor="lowBatteryFilter" 
              className="flex items-center"
            >
              <span className="w-4 h-4 mr-2 bg-orange-500 rounded-full"></span>
              Low Battery Robots
            </label>
          </div>
        </div>

        {/* Robot Count */}
        <div className="mt-4 text-sm text-gray-600 mb-4">
          Showing {filteredRobots.length} of {robots.length} robots
        </div>

        {/* Robot List */}
        <div className="space-y-2">
          {filteredRobots.map(robot => (
            <div 
              key={robot['Robot ID']} 
              className={`p-3 rounded ${
                !robot['Online/Offline'] ? 'bg-red-100' : 
                robot['Battery Percentage'] < 20 ? 'bg-yellow-100' : 
                'bg-green-100'
              }`}
            >
              <div className="font-semibold">Robot ID: {robot['Robot ID'].split('-')[0]}</div>
              <div>Status: {robot['Online/Offline'] ? 'Online' : 'Offline'}</div>
              <div>Battery: {robot['Battery Percentage']}%</div>
              <div>CPU Usage: {robot['CPU Usage']}%</div>
              <div>RAM: {robot['RAM Consumption']} MB</div>
              <div>Last Updated: {robot['Last Updated']}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map View */}
      <div className="w-3/4">
        <MapContainer 
          center={[0, 0]} 
          zoom={3} 
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {filteredRobots.map(robot => (
            <Marker
              key={robot['Robot ID']}
              position={robot['Location Coordinates']}
              icon={
                !robot['Online/Offline'] ? offlineIcon : 
                robot['Battery Percentage'] < 20 ? lowBatteryIcon : 
                onlineIcon
              }
            >
              <Popup>
                <div>
                  <strong>Robot ID:</strong> {robot['Robot ID']}<br/>
                  <strong>Status:</strong> {robot['Online/Offline'] ? 'Online' : 'Offline'}<br/>
                  <strong>Battery:</strong> {robot['Battery Percentage']}%<br/>
                  <strong>CPU Usage:</strong> {robot['CPU Usage']}%<br/>
                  <strong>RAM:</strong> {robot['RAM Consumption']} MB<br/>
                  <strong>Last Updated:</strong> {robot['Last Updated']}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default RobotDashboard;