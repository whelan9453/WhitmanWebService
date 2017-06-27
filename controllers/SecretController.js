let WhitmanError = require('../exception/WhitmanError');
let SecretModel = require('../models/SecretModel');

let getUpdateToken = async function (req, res, next) {
    let token;
    try {
        token = await SecretModel.getUploadToken(req, res);
    } catch (error) {
        console.error(new Date(), 'SecretController.getUpdateToken failed', JSON.stringify(error));
        if (!res.status) res.status(500);
        return res.send(error instanceof WhitmanError ? error : 'Failed to get upload token.');
    }
    res.send(token);
}

module.exports = {
    getUpdateToken: getUpdateToken
};