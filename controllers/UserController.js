let WhitmanError = require('../exception/WhitmanError');
let UserModel = require('../models/UserModel');
let crypto = require('crypto');

let checkTokenAndParameter = async function (req, res, token, email, context) {
    if (!token) {
        res.status(401);
        return res.send(new WhitmanError(WhitmanError.INVALID_SESSION_TOKEN, 'Empty session token'));
    }
    if (!email) {
        res.status(400);
        return res.send(new WhitmanError(WhitmanError.INVALID_PARAMETERS, 'Empty email.'));
    }
    if (!context) {
        res.status(400);
        return res.send(new WhitmanError(WhitmanError.INVALID_PARAMETERS, 'Empty context.'));
    }
    let user;
    try {
        user = await UserModel.fetchUser(req, res, email, token);
    } catch (error) {
        console.error(new Date(), 'UserController.getUserInfo failed', JSON.stringify(error));
        if (!res.status) res.status(500);
        return res.send(error instanceof WhitmanError ? error : 'Failed to fetch user information.');
    }
    if (token !== user.sessionToken) {
        console.error(new Date(), 'Invalid session token.', user, typeof user);
        res.status(401);
        return res.send(new WhitmanError(WhitmanError.INVALID_SESSION_TOKEN, 'Invalid session token.'));
    }
    return user;
}

let getUserInfo = async function (req, res, next) {
    let token = req.headers['x-whitman-session-token'], email = req.body.email;
    let user = await checkTokenAndParameter(req, res, token, email, 'NOCONTEXT');
    delete user.sessionToken;
    res.send(user);
}

let createUser = async function (req, res, next) {
    let email = req.body.email, displayName = req.body.displayName, validation = email + displayName + 'whitman2017', token;
    if (!email || !displayName) {
        res.status(400);
        return res.send(new WhitmanError(WhitmanError.INVALID_PARAMETERS, 'Empty email or displayName.'))
    }
    try {
        token = crypto.createHash('md5').update(validation).digest("hex");
        console.log(new Date(), 'token for', email, 'is', token);
        await UserModel.createUser(req, res, email, displayName, token);
    } catch (error) {
        console.error(new Date(), 'UserController.createUser failed', JSON.stringify(error));
        if (!res.status) res.status(500);
        return res.send(error instanceof WhitmanError ? error : 'Failed to create a new user.');
    }
    res.send({ 'token': token });
}

let updateUser = async function (req, res, next) {
    let token = req.headers['x-whitman-session-token'], email = req.body.email, context = req.body.context;
    let user = await checkTokenAndParameter(req, res, token, email, context);
    context = Object.assign({}, user.context, context);
    await UserModel.updateUser(req, res, email, context);
    res.send('ok');
}

module.exports = {
    getUserInfo: getUserInfo,
    createUser: createUser,
    updateUser: updateUser
};