//errorHandler
module.exports.errorHandler = (statusCode, message) => {
    const error = new Error(message || "Message");
    error.statusCode = statusCode;
    error.message = message;
    return error;
}