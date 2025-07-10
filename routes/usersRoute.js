const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/register', async (req, res) => { 
    try {
        const {name, email, password} = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists with this email'});
        }
        
        // Create new user
        const newUser = new User({name, email, password});
        await newUser.save();
        
        // Return user data without password
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        };
        
        res.status(201).json({user: userResponse, message: 'User registered successfully'});
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({message: 'Server error during registration'});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        
        // Find user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: 'User not found with this email'});
        }
        
        // Check password
        if (password !== user.password) {
            return res.status(400).json({message: 'Invalid password'});
        }
        
        // Return user data without password
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };
        
        res.status(200).json({user: userResponse, message: 'Login successful'});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({message: 'Server error during login'});
    }
});

module.exports = router;
