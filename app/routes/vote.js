const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/async.middleware');
const CheckAuth = require('../middleware/checkAuth.middleware');
const VoteingController = require('../controller/voteing.controller');
const IdValidator = require('../middleware/validateObjectId');


const { authVote } = new CheckAuth();
const { validateObjectId } = new IdValidator();
const {
  vote
} = new VoteingController();


router.post('/:id', validateObjectId, authVote, asyncMiddleware(vote));
module.exports = router;