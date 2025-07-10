const mongoose = require('mongoose');
mongoURL = 'mongodb+srv://rushi:mongodb6767@cluster0.dtvf488.mongodb.net/mern-rooms'

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
