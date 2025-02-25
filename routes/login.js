const express = require('express');
const router = express.Router();
const collection = require('../Database/user');

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const checkUsername = await collection.findOne({ username: username });
        const checkPassword = await collection.findOne({ password: password });

        if (checkUsername && checkPassword) {
            res.status(409).json({message:'Invalid credentials'});
        } else {
            res.status(201).json({message:'Login successfully'});
        }
    } catch (e) {
        res.status(500).json({ error:'notexist'});
    }
});

module.exports = router;
