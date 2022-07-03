
const bodyParser = require('body-parser');
const express = require('express');
const election = require('../routes/election');
const user = require('../routes/user');
const condidate = require('../routes/condidate');
const auth = require('../routes/auth');
const vote = require('../routes/vote');
const error = require('../middleware/error');



module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(express.json());
  app.use('/api/elections', election);
  app.use('/api/users', user);
  app.use('/api/condidates', condidate);
  app.use('/api/vote', vote);
  app.use('/api/auth', auth);
  app.use(error);
}