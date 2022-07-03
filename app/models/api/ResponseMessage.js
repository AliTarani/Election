class ResponseMessage {
    constructor({
        eventId,
        messageId,
        type,
        message,
        alertUser = false
    }) {
        this.eventId = eventId;
        this.messageId = messageId;
        this.type = type;
        this.message = message;
        this.alertUser = alertUser;
    }
}
module.exports = ResponseMessage;
