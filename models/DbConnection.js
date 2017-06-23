let WhitmanError = require('../exception/WhitmanError');
let MongoClient = require('mongodb').MongoClient;
let mongoUri = process.env.DATABASE_URI || 'mongodb://whitman:IPIgBMtY2VZlRynNxTmirxM4uMEz7d3tvDRzSpIyRpW9ZQj6ShPpbt1aHX1Tg96GW9LkDUkM2oad6vxnZCnjJA==@whitman.documents.azure.com:10255/whitman?ssl=true';
let db;

let getDbConn = async function (req, res) {
    if (!db) {
        try {
            db = await MongoClient.connect(mongoUri, { 'poolSize': 10 });
            console.log(new Date(), 'Created a new db connection.');
        } catch (error) {
            console.error(new Date(), 'DB connection error\n', error);
            res.status(500);
            throw new WhitmanError(WhitmanError.DB_CONNECTION_ERROR, 'DB connection error.');
        }
    } else {
        //db connection is okay
        console.log(new Date(), 'Reuse an existed connection.');
    }
    return db;
}

let flushDbPool = function() {
    db = null;
}

module.exports = {
    getDbConn: getDbConn,
    flushDbPool: flushDbPool
};