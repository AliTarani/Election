const mongoose = require('mongoose');
const ResposeResult = require('../models/api/ResponseResult');
const ResponseMessage = require('../models/api/ResponseMessage');


class IdValidation {

    validateObjectId(req, res, next) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            next();
        } else {
            const response = new ResposeResult({
                success: false,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 401,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: 'آیدی نا معتبر، دوباره امتحان کنید',
                        alertUser: true
                    })
                ]
            });
            const httpMethodCode = 400;
            res.status(httpMethodCode).send(response);
        }
    };
}
module.exports = IdValidation;