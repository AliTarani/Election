const Joi = require('joi');

class CondidateValidation {
  constructor() {
    this.condidateSchema = {
      election: Joi.objectId()
        .required(),
      user: Joi.objectId()
        .required(),
      slogan: Joi.string()
        .min(5)
        .max(100),
      promisses: Joi.array()
        .items(
          Joi.string()
            .min(5)
            .max(200)
        ),
      education: Joi.array()
        .items(
          Joi.string()
            .min(5)
            .max(200)
        ),
      bio: Joi.string()
        .min(5)
        .max(300),
    }

    this.condidateUpdateSchema = {
      slogan: Joi.string()
        .min(5)
        .max(100),
      promisses: Joi.array()
        .items(
          Joi.string()
            .min(5)
            .max(200)
        ),
      education: Joi.array()
        .items(
          Joi.string()
            .min(5)
            .max(200)
        ),
      bio: Joi.string()
        .min(5)
        .max(300),
    }

  }
  validateCondidate(condidate) {
    return Joi.validate(condidate, this.condidateSchema)
  }

  updateValidateCondidate(condidate) {
    return Joi.validate(condidate, this.condidateUpdateSchema)
  }

}
module.exports = CondidateValidation;