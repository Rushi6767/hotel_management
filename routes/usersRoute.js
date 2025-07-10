const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/register', async (req, res) => { 
    const {name, email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
        return res.status(400).json({message: 'User already exists'});
    }
    const newUser = new User({name, email, password});
    await newUser.save();
    res.status(201).json(newUser);
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email, password});
    if (!user) {
        return res.status(400).json({message: 'User does not exist'});
    }
    if (password !== user.password) {
        return res.status(400).json({message: 'Invalid password'});
    }
    const tempUser = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id
    }
    res.send(tempUser);
    // res.status(200).json({message: 'Login successful', tempUser});
});

// ✅ ADD THIS LINE
module.exports = router;
