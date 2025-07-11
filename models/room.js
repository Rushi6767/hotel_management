const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  maxcount: {
    type: Number,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  rentperday: {
    type: Number,
    required: true,
  },
  type: {
      type: String,
      required: true
    },
    description: {
        type: String,
        required: true
    },
    imageurls: {
        type: [String], // array of image URLs
        default: [],
    },
  currentbookings: [],
  type: {
    type: String,
    required: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

const roomModel = mongoose.model('rooms', roomSchema);

module.exports = roomModel;
