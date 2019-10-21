const jwt = require('jsonwebtoken');
const privateKey = require('../config/default.json');

module.exports = function (req,res,next){
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No Token provided.');
    
    try{
        const decoded = jwt.verify(token,privateKey.jwtPrivateKey);
        req.user = decoded ; 
        next();
    }
    catch(ex){
        res.status(400).send('Invalid Token');
    }
    
}
