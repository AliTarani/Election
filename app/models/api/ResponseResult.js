class ResponseResult {
    constructor({ success, result, message }) {
        this.success = success;
        this.result = result;
        this.message = message;
    }
}
module.exports = ResponseResult;