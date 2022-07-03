const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
const winston = require('winston');
const UserServic = require('./service/user.service')
aaa = new UserServic();


app.use(cors());

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();


const port = config.get("port") || 3000;
app.listen(port, () => winston.info(`listening on port ${port}`)) 