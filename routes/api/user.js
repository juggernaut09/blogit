const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || "bloggit";

const validateSignupInput = require('../../validation/signup');
const {validateLoginInput} = require('../../validation/login');
const User = require('../../models/User');


router.post('/signup', (req, res) => {
    const {errors, isValid} = validateSignupInput(req.body);
    const {user_name, password, email} = req.body;

    if(!isvalid){
        return res.status(400).json(errors);
    }
    User.findOne({$or: [{email}, {user_name}]})
        .then(user => {
            if(user) {
                if(user.email === email){
                    return res.status(400).json({
                        email: "Email already exists"
                    });
                }
                else {
                    return res.status(400).json({
                        user_name: "User name already exists"
                    });
                }
            }
            else {
                const newUser = new User({user_name, email, password});
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                                .then(user => {return res.json(user)})
                                .catch(err => {return res.status(400).json({error: "Error creating a new User"})});
                    });
                });
            }
        });
});

router.post('login', (req, res)=> {
    const {errors, isValid} = validateLoginInput(req.body);
    const {email, password} = req.body;

    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne({email})
        .then(user => {
            if(!user) {
                return res.status(404).json({email: "Email not found"});
            }

            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                    if(isMatch){
                        const payLoad = {
                            id: user.id,
                            user_name: user.user_name
                        };
                        jwt.sign(payLoad, SECRET, { expiresIn: 3600}, (err, token) => {
                            if(err){
                                return res.status(400).json({error: err});
                            }
                            return res.json({
                                success: true,
                                token : "Bearer "+ token
                            });
                        });
                        
                    } else {
                        return res.status(400).json({ password: "Password Incorrect" });
                    }
                  });

        });
});

module.exports = router;