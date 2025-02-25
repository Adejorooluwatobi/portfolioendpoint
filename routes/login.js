const express = require('express');
const router = express.Router();
const collection = require('../Database/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'your-secret-key';

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await collection.findOne({ username: username });

        if (user) {
            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                // Generate a JWT token
                const token = jwt.sign(
                    { username: user.username, email: user.email }, 
                    SECRET_KEY,
                );
                res.status(201).json({
                    message: 'Login successful',
                    token: token
                });
            } else {
                // Invalid password
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            // User not found
            res.status(404).json({ message: 'User not found' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
