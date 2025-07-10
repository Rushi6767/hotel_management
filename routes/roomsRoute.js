const express = require('express');
const router = express.Router();
const Room = require('../models/room'); // adjust path as needed

// Get all rooms
router.get('/getallrooms', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.send({rooms});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get room by ID
// router.get('/getroombyid/:id', async (req, res) => {
//   try {
//     const room = await Room.findById(req.params.id);
//     if (!room) return res.status(404).json({ message: 'Room not found' });
//     res.json(room);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Create a new room
// router.post('/addroom', async (req, res) => {
//   const room = new Room(req.body);
//   try {
//     const newRoom = await room.save();
//     res.status(201).json(newRoom);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;
