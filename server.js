const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// DB config
const dbconfig = require('./db');

// Middleware to parse JSON
app.use(express.json());

// Routes
const roomsRoute = require('./routes/roomsRoute');
const usersRoute = require('./routes/usersRoute');

app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute);

// Root test route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
