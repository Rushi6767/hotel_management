// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const dbconfig = require('./db')
const roomsRoute = require('./routes/roomsRoute'); // adjust path as needed
app.use('/api/rooms', roomsRoute);

// Middleware to parse JSON
app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
