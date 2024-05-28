// // // Import required modules
// // const express = require('express');
// // const bodyParser = require('body-parser');

// // // Create an Express application
// // const app = express();

// // // Set up middleware to parse JSON request bodies
// // app.use(bodyParser.json());

// // // Route to receive notifications
// // app.post('/send-notification', (req, res) => {
// //     const { guestName, meetingGuyName, purposeOfMeeting } = req.body;

// //     // Here you can process the received notification
// //     // For demonstration, we'll just log it
// //     console.log(`Received notification - Guest Name: ${guestName}, Meeting Guy's Name: ${meetingGuyName}, Purpose of Meeting: ${purposeOfMeeting}`);

// //     // Respond with a success message
// //     res.json({ message: 'Notification received successfully' });
// // });

// // // Start the server
// // const port = process.env.PORT || 3000;
// // app.listen(port, () => {
// //     console.log(`Server running at http://localhost:${port}`);
// // });
// const WebSocket = require('ws');
// const express = require('express');
// const http = require('http');

// // Initialize Express and HTTP server
// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// // Store connected clients
// let clients = [];

// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   clients.push(ws);

//   ws.on('close', () => {
//     console.log('Client disconnected');
//     clients = clients.filter(client => client !== ws);
//   });
// });

// // Broadcast notification to all connected clients
// function broadcastNotification(notification) {
//   clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(notification));
//     }
//   });
// }

// // Define an endpoint to trigger notifications
// app.use(express.json());
// app.post('/notify', (req, res) => {
//   const { guestName, meetingGuyName, purposeOfMeeting } = req.body;
//   const notification = { guestName, meetingGuyName, purposeOfMeeting };
  
//   // Broadcast the notification to all clients
//   broadcastNotification(notification);

//   res.sendStatus(200);
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const WebSocket = require('ws');
const express = require('express');
const http = require('http');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
let clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.push(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter(client => client !== ws);
  });
});

// Broadcast notification to all connected clients
function broadcastNotification(notification) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
}

// Define an endpoint to trigger notifications with document attachments
app.use(express.json());
app.post('/notify', (req, res) => {
  const { guestName, meetingGuyName, purposeOfMeeting, documents } = req.body;
  const notification = { guestName, meetingGuyName, purposeOfMeeting, documents };
  
  // Broadcast the notification to all clients
  broadcastNotification(notification);

  res.sendStatus(200);
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

