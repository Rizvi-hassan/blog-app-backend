const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



router.post('/adduser',[
    body('name', 'Please enter valid name').isLength({min:3}),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password must be 5 character long').isLength({min:5})
], async (req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({attempt: "success" , errors: error.array()});
    }
    try {
        const JWT_SIGN = process.env.JWT_SIGN;
        console.log(JWT_SIGN);
        //Checking if user already exists
        // console.log()
        let user = await User.findOne({email: req.body.email})
        if (user){
            return res.status(400).json({attempt: "fail", errors: {msg: "A user with same email already exists"}});
        }
        const salt = await bcrypt.genSalt(10);
        const safePwd = await bcrypt.hash(req.body.password, salt);
        user = await User.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: safePwd
            });

        const data = {
            user:{
                id: user.id,
                name: user.name
            }
        }
        const token = await jwt.sign(data, JWT_SIGN);
        res.json({attempt: 'success', token});

    } catch (error) {
        console.error(error);
        res.status(500).json({attempt:'fail', errors:{msg:"Something went wrong "}})
    }
})

module.exports = router;