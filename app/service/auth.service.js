const ServiceResult = require('../models/api/ServiceResult');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const User = require('../models/database/user')
const UserService = require('../service/user.service')
const userService = new UserService();

class AuthService {
  //registerStudentService---------------------------------------------------------
  async registerUsreService(user) {
    const result = await userService.createUserService(user);

    if (!result.success) return new ServiceResult(result);

    return result;
  }

  //studentLoginWithEmail----------------------------------------------------------
  async userLoginService({ melliCode, password }) {
    //get student by email
    const user = await User.findOne({ melliCode: melliCode });

    // check if student with given user exist
    if (!user) {
      return new ServiceResult({
        success: false,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 400,
            type: ResponseMessageType.error,
            message: 'کد ملی یا رمزعبور نادرست است!',
            alertUser: true
          })
        ],
        httpMethodCode: 400
      });
    }

    const validPassword = await user.validatePassword(password);

    // check password validation
    if (!validPassword) {
      return new ServiceResult({
        success: false,
        result: 'Error',
        message: [
          new ResponseMessage({
            eventId: 403,
            type: ResponseMessageType.error,
            message: 'کد ملی یا رمزعبور نادرست است!',
            alertUser: true
          })
        ],
        httpMethodCode: 403
      });
    }

    //generate Auth token in student model
    const jwtToken = await user.generateAuthToken();

    const data = {
      jwtToken
    };
    return new ServiceResult({
      success: true,
      result: data,
      message: [
        new ResponseMessage({
          eventId: 200,
          type: ResponseMessageType.success,
          message: `خوش آمدید ${user.name}`,
          alertUser: true
        })
      ],
      httpMethodCode: 200
    });
  }
}
module.exports = AuthService;