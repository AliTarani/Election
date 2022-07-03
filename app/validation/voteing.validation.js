const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


class VoteingValidation {
  constructor() {
    this.voteSchema = {
      condidates: Joi.array()
        .items(
          Joi.objectId()
        ),
      userId: Joi.objectId()
    }
  }
  validateVote(vote) {
    return Joi.validate(vote, this.voteSchema)
  }
}
module.exports = VoteingValidation;