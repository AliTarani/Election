const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


class UserValidation {
  constructor() {
    this.userSchema = {
      name: Joi.string()
        .min(2)
        .max(50)
        .required(),
      melliCode: Joi.string()
        .regex(/^\d{10}$/)
        .required(),
      phoneNumber: Joi.string()
        .regex(/^[0-9]*$/)
        .min(10)
        .max(15),
      password: Joi.string()
        .required()
        .min(5)
        .max(32),
      profileImage: Joi.string()
        .min(5),
      isAdmin: Joi.boolean()

      // ,
      // elections: Joi.array()
      //   .items(Joi.object().keys({
      //     election: Joi.objectId(),
      //     condidates: Joi.array()
      //       .items(Joi.objectId())
      //   }))
    }
    this.userUpdateSchema = {
      name: Joi.string()
        .min(2)
        .max(50),
      password: Joi.string()
        .min(5)
        .max(32),
      oldPassword: Joi.string()
        .min(5)
        .max(32),
      profileImage: Joi.string()
        .min(5),
      phoneNumber: Joi.string()
        .regex(/^[0-9]*$/)
        .min(10)
        .max(15),
      isAdmin: Joi.boolean()
    }
    this.bbb = {
      condidates: Joi.array()
        .items(
          Joi.objectId()
        )
    }

  }
  validateUser(user) {
    return Joi.validate(user, this.userSchema)
  }

  updateValidateUser(user) {
    return Joi.validate(user, this.userUpdateSchema)
  }

  // aaa(user) {
  //   return Joi.validate(user, this.bbb)
  // }

}
module.exports = UserValidation;