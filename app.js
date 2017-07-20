let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let WhitmanError = require('./exception/WhitmanError');
let mount = process.env.PARSE_MOUNT;
let REST_KEY = process.env.REST_KEY;

let app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
app.get('/versionInfo', function (req, res) {
  res.status(200).send('20170720 Add an embedded image in the email.');
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