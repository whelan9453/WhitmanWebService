let UserController = require('../controllers/UserController');
let WhitmanError = require('../exception/WhitmanError');
const pug = require('pug');
const path = require('path');

let genPaper = async function (req, res, next) {
    let token = req.headers['x-whitman-session-token'], email = req.body.email;
    let user = await UserController.checkToken(req, res, token, email);
    let context = user.context;
    if (!context) {
        res.status(400);
        return res.send(new WhitmanError(WhitmanError.EMPTY_CONTEXT, 'Empty user context.'));
    }
    console.log(new Date(), 'context', context);
    let paper, filePath;
    let isWin = /^win/.test(process.platform);
    console.log('isWin', isWin);
    try {
        filePath = isWin ? path.join('assets', 'enquirer', 'enquirer.pug') : path.join('bin', 'assets', 'enquirer', 'enquirer.pug');
        console.log('filePath', filePath);
        paper = pug.renderFile(filePath, context);
    } catch (error) {
        console.error(new Date(), 'NewsGenController.genPaper failed', error);
        res.status(400);
        return res.send(new WhitmanError(WhitmanError.RENDER_PAPER_FAILED, 'Rendering failed.'));
    }
    console.log(paper);
    res.send(paper);
}

module.exports = {
    genPaper: genPaper
};