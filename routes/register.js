const express = require('express');
const router = express.Router();
const collection = require('../Database/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'your-secret-key';

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    // const data = {
    //     username: username,
    //     email: email,
    //     password: password
    // };

    try {
        const isEmailExist = await collection.findOne({ email: email });
        const isUserName = await collection.findOne({ username: username });

        if (isEmailExist || isUserName) {
            res.status(409).json({message:"Account already Exist"});
        } else {
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

            const data = {
                username: username,
                email: email,
                password: hashedPassword
            };
            await collection.insertMany([data]);

            const token = jwt.sign(
                { email: email, username: username },
                SECRET_KEY,
            );
            res.status(201).json({message:"account created successfully", token: token });
            
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
