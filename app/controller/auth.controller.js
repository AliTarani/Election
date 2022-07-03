const UserValidation = require('../validation/user.validation');
const LoginValidation = require('../validation/login.validation');
const ResponseMessage = require('../models/api/ResponseMessage');
const ResponseMessageType = require('../models/api/ResponseMessageType');
const ResponseResult = require('../models/api/ResponseResult');
const AuthService = require('../service/auth.service');

const userValidation = new UserValidation();
const authService = new AuthService();
const loginValidation = new LoginValidation();

class AuthController {
    //registerUser----------------------------------------------------------
    async registerUser(req, res) {

        //validate request body (JOI)
        const { error, value } = userValidation.validateUser(req.body);

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

            // Send data to auth service
            const result = await authService.registerUsreService({ ...value });
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

    //loginStudent----------------------------------------------------------
    async loginUser(req, res) {
        // validate request body (JOI)
        const { error, value } = loginValidation.validateUserLogin(req.body);

        let response;
        let httpMethodCode;
        let token;
        const errors = [];

        if (error) {
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

            //send data to auth service
            const result = await authService.userLoginService({ ...value });

            if (!result.success) {
                const msg = new ResponseMessage({
                    eventId: 400,
                    messageId: 1,
                    type: ResponseMessageType.error,
                    message: result.message.map(item => item.message),
                    alertUser: true
                });
                response = new ResponseResult({ success: false, message: msg });
                httpMethodCode = result.message[0].eventId;
            } else {
                response = new ResponseResult({
                    success: result['success'],
                    result: result['result'],
                    message: result['message']
                });
                token = result.result['jwtToken'];
                httpMethodCode = 200;
            }
        }
        return res
            .header('x-auth-token', token)
            .status(httpMethodCode)
            .send(response);
    }
}

module.exports = AuthController;
