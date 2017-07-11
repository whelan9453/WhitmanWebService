let UserController = require('../controllers/UserController');
let WhitmanError = require('../exception/WhitmanError');
const pug = require('pug');
const path = require('path');

let fs = require('fs');
let pdf = require('html-pdf');

let createPdfPromise = function (html, options, email) {
    return new Promise(function (resolve, reject) {
        pdf.create(html, options).toFile(`${email}.pdf`, function (err, res) {
            if (err) {
                console.error(new Date(), 'NewsGenController.createPdfPromise failed', err);
                reject(err);
            }
            else {
                console.log('res', res);
                resolve(res);
            }
        });
    });
}

let transHtmlToPdf = async function (path, resourcePath, email) {
    let html = fs.readFileSync(path, 'utf8');
    let options = { base: '../bin/assets/enquirer', height: "1650px", width: "1275px", border: "0" };
    try {
        await createPdfPromise(html, options, email);
    } catch (error) {
        throw new WhitmanError(WhitmanError.OUTPUT_PDF_FAILED, 'Creating pdf failed.');
    }
}

let writeFilePromise = function (filename, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, data, function (err) {
            if (err) {
                console.error(new Date(), 'NewsGenController.writeFilePromise failed', err);
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}

let genPaper = async function (req, res, next) {
    let token = req.headers['x-whitman-session-token'], email = req.body.email;
    let user = await UserController.checkToken(req, res, token, email);
    let context = user.context;
    if (!context) {
        res.status(400);
        return res.send(new WhitmanError(WhitmanError.EMPTY_CONTEXT, 'Empty user context.'));
    }
    // console.log(new Date(), 'context', context);
    let paper;
    let isWin = /^win/.test(process.platform);
    console.log('isWin', isWin);
    try {
        let filePath = isWin ? path.join('assets', 'enquirer', 'enquirer.pug') : path.join('bin', 'assets', 'enquirer', 'enquirer.pug');
        console.log('filePath', filePath);
        paper = pug.renderFile(filePath, context);
    } catch (error) {
        console.error(new Date(), 'NewsGenController.genPaper failed (render)', error);
        res.status(400);
        return res.send(new WhitmanError(WhitmanError.RENDER_PAPER_FAILED, 'Rendering failed.'));
    }
    try {
        let filename = isWin ? path.join('assets', 'enquirer', `${email}.html`) : path.join('bin', 'assets', 'enquirer', `${email}.html`);
        let resourcePath = isWin ? path.join('assets', 'enquirer') : path.join('bin', 'assets', 'enquirer');
        console.log('resourcePath', resourcePath);
        await writeFilePromise(filename, paper);
        await transHtmlToPdf(filename, resourcePath, email);
    } catch (error) {
        console.error(new Date(), 'NewsGenController.genPaper failed (html + pdf)', error);
        let retErr = error instanceof WhitmanError ? error : new WhitmanError(WhitmanError.RENDER_PAPER_FAILED, 'Writing html failed.');
        return res.send(retErr);
    }
    // console.log(paper);
    res.send(paper);
}

module.exports = {
    genPaper: genPaper
};