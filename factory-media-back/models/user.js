const mongoose =require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const privateKey = require('../config/default.json');

const complexityOptions = {
  min: 6,
  max: 255,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 0,
  requirementCount: 2,
}
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    role: {
        type: Boolean,
        required: true
    }, 
}, { timestamps: { createdAt: 'created_at' }})


userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id,name: this.name,role: this.role},privateKey.jwtPrivateKey, { expiresIn: '1h' });
    return token;
}
const User = new mongoose.model('User',userSchema);




function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: new PasswordComplexity(complexityOptions),
        role: Joi.boolean().required(),
    }
    return Joi.validate(user,schema);
}


exports.User = User; 
exports.validate = validateUser;