const winston = require('winston');
const mongose = require('mongoose');
const config = require('config');

module.exports = function () {
  mongose.connect(config.get("database"), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => winston.info("conect to data base"));
}