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
WhitmanError.PATH_NOT_FOUND = 404;

/**
 * Error code indicating that connection to mongo db was failed.
 * @property DB_CONNECTION_ERROR
 * @static
 * @final
 */
WhitmanError.DB_CONNECTION_ERROR = 1000;

/**
 * Error code indicating that db operation was failed.
 * @property DB_OPERATION_FAILED
 * @static
 * @final
 */
WhitmanError.DB_OPERATION_FAILED = 1001;

/**
 * Error code indicating object not found.
 * @property DB_OBJ_NOT_FOUND
 * @static
 * @final
 */
WhitmanError.DB_OBJ_NOT_FOUND = 1002;

/**
 * Error code indicating that the user client attempted to create is already existed.
 * @property USER_ALREADY_EXISTED
 * @static
 * @final
 */
WhitmanError.USER_ALREADY_EXISTED = 1003;

/**
 * Error code indicating that the key is invalid.
 * @property INVALID_KEY
 * @static
 * @final
 */
WhitmanError.INVALID_KEY = 1050;

/**
 * Error code indicating that the parameters are invalid.
 * @property INVALID_PARAMETERS
 * @static
 * @final
 */
WhitmanError.INVALID_PARAMETERS = 1051;

/**
 * Error code indicating that session token is invalid.
 * @property INVALID_SESSION_TOKEN
 * @static
 * @final
 */
WhitmanError.INVALID_SESSION_TOKEN = 1052;

/**
 * Error code indicating that user context is empty.
 * @property EMPTY_CONTEXT
 * @static
 * @final
 */
WhitmanError.EMPTY_CONTEXT = 1053;

/**
 * Error code indicating that newspaper rendering is failed.
 * @property RENDER_PAPER_FAILED
 * @static
 * @final
 */
WhitmanError.RENDER_PAPER_FAILED = 1054;

/**
 * Error code indicating that writing html file is failed.
 * @property OUTPUT_HTML_FAILED
 * @static
 * @final
 */
WhitmanError.OUTPUT_HTML_FAILED = 1055;

/**
 * Error code indicating that writing pdf file is failed.
 * @property OUTPUT_PDF_FAILED
 * @static
 * @final
 */
WhitmanError.OUTPUT_PDF_FAILED = 1056;

/**
 * Error code indicating that paper type is invalid.
 * @property INVALID_PAPER_TYPE
 * @static
 * @final
 */
WhitmanError.INVALID_PAPER_TYPE = 1057;

module.exports = WhitmanError;