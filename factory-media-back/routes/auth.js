const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 6,
  max: 255,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 0,
  requirementCount: 2,
}

function validateUser(user){
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: new PasswordComplexity(complexityOptions)
    }
    return Joi.validate(user,schema);
}

router.post("/",  async (req, res) => {
    //console.log("-------")
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password,user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password');
    const token = user.generateAuthToken();
    
    res.send(token);
});


module.exports = router;