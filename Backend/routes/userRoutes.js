const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    res.send('User routes are working!');
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const user = new User({
            name,
            email,
            password
        });
        await user.save();
        const transformedUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
        };
        res.status(201).send({ user: transformedUser, message: 'User created successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});
router.post('/login',async(req,res)=>{
    try{

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            throw new Error('Unable to login, invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new Error('Unable to login, invalid credentials');
        }
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const transformedUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
        };
        res.send({ user: transformedUser, token, message: 'Login successful' });

    }catch(error){
        res.status(400).send({error: error.message});
    }

});
//register a user
//login a user


module.exports = router;