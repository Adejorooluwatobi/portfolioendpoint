const express = require('express');
const router = express.Router();
const collection = require('../Database/user');

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    const data = {
        username: username,
        email: email,
        password: password
    };

    try {
        const isEmailExist = await collection.findOne({ email: email });
        const isUserName = await collection.findOne({ username: username });

        if (isEmailExist || isUserName) {
            res.json("Exist");
        } else {
            res.json("account created successfully");
            await collection.insertMany([data]);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
