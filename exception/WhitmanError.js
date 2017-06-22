/**
 * Constructs a new WhitmanError object with the given code and message.
 * @constructor
 * @param {Number} code An error code constant.
 * @param {String} message A detailed description of the error.
 */
let WhitmanError = function WhitmanError(code, message) {
    this.code = code;
    this.message = message;
}

/**
 * Error code indicating that connection to mongo db was failed.
 * @property PATH_NOT_FOUND
 * @static
 * @final
 */
WhitmanError.PATH_NOT_FOUND = 1000;

module.exports = WhitmanError;