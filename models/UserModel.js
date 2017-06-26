let DbConn = require('./DbConnection');
let WhitmanError = require('../exception/WhitmanError');
const COLL_NAME = 'User';

/**
 * Only for internal query. (NOT AN API)
 * @param {*} req 
 * @param {*} res 
 * @param {string} email 
 * @return {object}
 */
let queryUser = async function (req, res, email) {
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
 */
let fetchUser = async function (req, res, userEmail) {
    let user = await queryUser(req, res, userEmail);
    if (!user) {
        console.error(new Date(), 'Cannot find a user with the given email.');
        res.status(403);
        throw new WhitmanError(WhitmanError.DB_OBJ_NOT_FOUND, 'Cannot find a user with the given email.');
    }
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
    let user = await queryUser(req, res, userEmail);
    if (user) {
        res.status(409);
        throw new WhitmanError(WhitmanError.USER_ALREADY_EXISTED, 'This email has been used.');
    }
    let db = await DbConn.getDbConn(req, res);
    try {
        await db.collection(COLL_NAME).insert({ email: userEmail, displayName: displayName, sessionToken: sessionToken });
    } catch (error) {
        console.error(new Date(), 'UserModel.createUser error', JSON.stringify(error));
        DbConn.flushDbPool();
        res.status(500);
        throw new WhitmanError(WhitmanError.DB_OPERATION_FAILED, 'Insert failed.');
    }
    console.log(new Date(), 'UserModel.createUser succeeded.')
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {string} email 
 * @param {object} context 
 */
let updateUser = async function (req, res, email, context) {
    let result;
    try {
        let db = await DbConn.getDbConn(req, res);
        result = await db.collection(COLL_NAME).updateOne({ email: email }, { $set: { context: context } });
    } catch (error) {
        console.error(new Date(), 'UserModel.updateUser error', JSON.stringify(error));
        DbConn.flushDbPool();
        res.status(500);
        throw new WhitmanError(WhitmanError.DB_OPERATION_FAILED, 'Update failed.');
    }
    console.log(new Date(), 'UserModel.updateUser succeeded.', JSON.stringify(result));
}

module.exports = {
    fetchUser: fetchUser,
    createUser: createUser,
    updateUser: updateUser
};