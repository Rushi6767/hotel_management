const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });     

var connection = mongoose.connection

connection.on('error', ()=>{
    console.log("Failed ##########################")
})

connection.on('connected', ()=>{
    console.log("connected ******************* ")
})

module.exports = mongoose;
