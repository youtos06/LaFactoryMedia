const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();



const port = process.env.Port || 3100;
app.listen(port,()=>console.log('listening ..'+port))

