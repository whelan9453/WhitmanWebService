let DbConn = require('./DbConnection');
let WhitmanError = require('../exception/WhitmanError');
const COLL_NAME = 'Secret';

let getUploadToken = async function (req, res) {
    let token;
    try {
        let db = await DbConn.getDbConn(req, res);
        token = await db.collection(COLL_NAME).findOne({}, { fields: { _id: 0 } });
    } catch (error) {
        console.error(new Date(), 'SecretModel.getUploadToken error', JSON.stringify(error));
        DbConn.flushDbPool();
        res.status(500);
        throw new WhitmanError(WhitmanError.DB_OPERATION_FAILED, 'Query failed.');
    }
    if (!token) {
        console.error(new Date(), 'Cannot find any token.');
        res.status(403);
        throw new WhitmanError(WhitmanError.DB_OBJ_NOT_FOUND, 'Cannot find any token.');
    }
    return token;
}

module.exports = {
    getUploadToken: getUploadToken
};