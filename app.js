let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let WhitmanError = require('./exception/WhitmanError');
let mount = process.env.PARSE_MOUNT || '/1';

let app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(mount, require('./routes/WhitmanApi'));
app.use((req, res, next) => {
    res.status(404);
    res.send(new WhitmanError(WhitmanError.PATH_NOT_FOUND, 'Path not found.'));
});
module.exports = app;