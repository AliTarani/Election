const UserValidation = require('../validation/user.validation');
const LoginValidation = require('../validation/login.validation');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const ResponseResult = require('../models/api/ResponseResult');
const UserService = require('../service/user.service');

const userValidation = new UserValidation();
const userService = new UserService();

class UserController {
  async getUserById(req, res) {
    const id = req.params.id;
    const result = await userService.getUserByIdService(id);

    const response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    const httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

  async getUsers(req, res) {
    const name = req.params.name;
    let result;
    if (!!name)
      result = await userService.searchUsersService(name);

    else
      result = await userService.getAllUsersService();

    const response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    const httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

  async updateUser(req, res) {

    const { error, value } = userValidation.updateValidateUser(req.body);

    let response;
    let httpMethodCode;

    if (error) {
      const errors = [];
      error.details.forEach(err => {
        errors.push(
          new ResponseMessage({
            eventId: 400,
            messageId: 1,
            type: ResponseMessageType.error,
            message: err.message,
            alertUser: true
          })
        );
      });
      response = new ResponseResult({ success: false, message: errors });
      httpMethodCode = 400;
    } else {
      const id = req.params.id;

      // do some thing to profileimage 

      const result = await userService.updateUserByIdService(id, { ...value });
      if (result['success']) {
        result.result.password = '';
      }
      response = new ResponseResult({
        success: result['success'],
        result: result['result'],
        message: result['message']
      });

      httpMethodCode = result.httpMethodCode;
    }
    res.status(httpMethodCode).send(response);
  }

  async setAdminUser(req, res) {
    let response;
    let httpMethodCode;
    const melliCode = req.params.melliCode;

    const result = await userService.setUserAdminService(melliCode);
    if (result['success']) {
      result.result.password = '';
    }
    response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

  async unSetAdminUser(req, res) {
    let response;
    let httpMethodCode;
    const melliCode = req.params.melliCode;

    const result = await userService.unSetUserAdminService(melliCode);
    if (result['success']) {
      result.result.password = '';
    }
    response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

  async getAdminUser(req, res) {
    const result = await userService.getAllAdminUsersService();
    if (result['success']) {
      result.result.password = '';
    }
    const response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    const httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }

  async deleteUser(req, res) {
    const id = req.params.id;
    const result = await userService.deleteUserByIdService(id);
    let response;
    let httpMethodCode;
    response = new ResponseResult({
      success: result['success'],
      result: result['result'],
      message: result['message']
    });

    httpMethodCode = result.httpMethodCode;

    res.status(httpMethodCode).send(response);
  }


}

module.exports = UserController;
