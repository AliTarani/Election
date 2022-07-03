const ResponseResult = require('./ResponseResult');
class ServiceResult extends ResponseResult {
    constructor({
        httpMethodCode,
        success,
        result,
        message
    }) {
        super({
            success,
            result,
            message
        });
        this.httpMethodCode = httpMethodCode;
    }
}
module.exports = ServiceResult;