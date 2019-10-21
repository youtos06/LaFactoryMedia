const express = require('express');
const clients = require('../routes/clients');
const projects = require('../routes/projects');
const auth = require('../routes/auth');
const users = require('../routes/users');
const error = require('../middleware/error');

module.exports = function(app){
    app.use(express.json());  // parse json into req.body
    app.use(express.urlencoded({extended: true})) ; // key=value&key=value
    app.use(express.static('public')); // serve static content from route of site
    

    app.use('/api/clients',clients);
    app.use('/api/projects',projects);
    app.use('/api/users',users);
    app.use('/api/auth',auth);
    app.use(error);
}