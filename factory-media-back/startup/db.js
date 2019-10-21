const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect('mongodb://localhost/mediaFactory', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>winston.info('connected to mongodb'))
}