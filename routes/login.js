const express = require('express');
const router = express.Router();
const collection = require('../Database/user'); // Adjust the path as needed

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const checkUsername = await collection.findOne({ username: username });
        const checkPassword = await collection.findOne({ password: password });

        if (checkUsername && checkPassword) {
            res.json('Login successfully');
        } else {
            res.json('user does notexist');
        }
    } catch (e) {
        res.json('notexist');
    }
});

module.exports = router;
