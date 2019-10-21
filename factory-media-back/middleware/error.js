const winston = require('winston');

module.exports = function(err, req, res, next){
  winston.error(err.message, err);
  winston.add(winston.transports.File,{filename: 'logfile.log'})

  res.status(500).send('Something failed.');
}