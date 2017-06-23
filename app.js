let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let WhitmanError = require('./exception/WhitmanError');
let mount = process.env.PARSE_MOUNT || '/1';
let REST_KEY = process.env.REST_KEY || '1317f83b74067b835f3f8a2e86da0bd2d2006196efa77b7f0511096e68a9b0e7';

let app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/versionInfo', function (req, res) {
  res.status(200).send('20170623 Support user insert & query.');
});
//Check rest key
app.use((req, res, next) => {
    console.log('Check rest key validation');
    let restKey = req.headers['x-whitman-rest-key'];
    if (restKey !== REST_KEY) {
        res.status(401);
        return res.send(new WhitmanError(WhitmanError.INVALID_KEY, 'Invalid key.'));
    }
    next();
});
app.use(mount, require('./routes/WhitmanApi'));
app.use((req, res, next) => {
    res.status(404);
    res.send(new WhitmanError(WhitmanError.PATH_NOT_FOUND, 'Path not found.'));
});
module.exports = app;