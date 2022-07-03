const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


class ElectionValidation {
  constructor() {
    this.electionSchema = {
      title: Joi.string()
        .min(5)
        .max(60)
        .required(),
      cover: Joi.string(),
      endDate: Joi.string()
        .max(10),
      startDate: Joi.string()
        .max(10),
      voteLimit: Joi.number()
        .max(30),
      active: Joi.boolean(),
      condidates: Joi.array()
        .items(
          Joi.objectId()
        )
    }
    this.electionUpdateSchema = {
      title: Joi.string()
        .min(5)
        .max(60),
      cover: Joi.string(),
      endDate: Joi.string()
        .max(10),
      startDate: Joi.string()
        .max(10),
      voteLimit: Joi.number()
        .max(30),
      active: Joi.boolean(),
      condidates: Joi.array()
        .items(
          Joi.objectId()
        )

    }

  }
  validateElection(election) {
    return Joi.validate(election, this.electionSchema)
  }

  updateValidateElection(election) {

    return Joi.validate(election, this.electionUpdateSchema)
  }

}

module.exports = ElectionValidation;