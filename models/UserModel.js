let DbConn = require('./DbConnection');
let WhitmanError = require('../exception/WhitmanError');
const COLL_NAME = 'User';

/**
 * Only for internal query. (NOT AN API)
 * @param {*} req 
 * @param {*} res 
 * @param {string} email 
 * @param {string} token 
 * @return {object}
 */
let queryUser = async function (req, res, email, token) {
    try {
        let db = await DbConn.getDbConn(req, res);
        user = await db.collection(COLL_NAME).findOne({ email: email }, { fields: { _id: 0 } });
    } catch (error) {
        console.error(new Date(), 'UserModel.queryUser error', JSON.stringify(error));
        DbConn.flushDbPool();
        res.status(500);
        throw new WhitmanError(WhitmanError.DB_OPERATION_FAILED, 'Query failed.');
    }
    return user;
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {string} userEmail 
 * @param {string} sessionToken 
 */
let fetchUser = async function (req, res, userEmail, sessionToken) {
    let user = await queryUser(req, res, userEmail, sessionToken);
    if (!user) {
        console.error(new Date(), 'Cannot find a user with the given email.');
        res.status(403);
        throw new WhitmanError(WhitmanError.DB_OBJ_NOT_FOUND, 'Cannot find a user with the given email.');
    }
    if (sessionToken !== user.sessionToken) {
        console.error(new Date(), 'Invalid session token.', user, typeof user);
        res.status(401);
        throw new WhitmanError(WhitmanError.INVALID_SESSION_TOKEN, 'Invalid session token.');
    }
    delete user.sessionToken;
    return user;
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {string} userEmail 
 * @param {string} name 
 * @param {string} sessionToken 
 */
let createUser = async function (req, res, userEmail, displayName, sessionToken) {
    let user = await queryUser(req, res, userEmail, sessionToken);
    if (user) {
        res.status(409);
        throw new WhitmanError(WhitmanError.USER_ALREADY_EXISTED, 'This email has been used.');
    }
    let db = await DbConn.getDbConn(req, res);
    try {
        await db.collection(COLL_NAME).insert({email: userEmail, displayName: displayName, sessionToken: sessionToken});
    } catch (error) {
        console.error(new Date(), 'UserModel.createUser error', JSON.stringify(error));
        DbConn.flushDbPool();
        res.status(500);
        throw new WhitmanError(WhitmanError.DB_OPERATION_FAILED, 'Insert failed.');
    }
    console.log(new Date(), 'UserModel.createUser succeeded.')
}

module.exports = {
    fetchUser: fetchUser,
    createUser: createUser
};