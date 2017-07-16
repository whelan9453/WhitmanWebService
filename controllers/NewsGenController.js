let UserController = require('../controllers/UserController');
let WhitmanError = require('../exception/WhitmanError');
const pug = require('pug');
const path = require('path');

let fs = require('fs');
let pdf = require('html-pdf');
let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lostintimegroup@gmail.com',
        pass: 'lostintime4321'
    }
});

function sendMail(receiver, path) {
    let mailOptions = {
        from: 'lostintimegroup@gmail.com',
        to: receiver,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        attachments: [{   // file on disk as an attachment
            filename: 'newspaper.pdf',
            path: path // stream this file
        }]
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

let createPdfPromise = function (html, options, email) {
    return new Promise(function (resolve, reject) {
        pdf.create(html, options).toFile(`${email}.pdf`, function (err, res) {
            if (err) {
                console.error(new Date(), 'NewsGenController.createPdfPromise failed', err);
                reject(err);
            }
            else {
                console.log('res', res);
                sendMail(email, `${email}.pdf`);
                resolve(res);
            }
        });
    });
}

let transHtmlToPdf = async function (path, resourcePath, email, type) {
    let html = fs.readFileSync(path, 'utf8');
    let paperH = type === 'enquirer' ? '1650px' : '2100px';
    let paperW = type === 'enquirer' ? '1275px' : '1270px';
    let options = { base: `../bin/assets/${type}`, height: paperH, width: paperW, border: "0" };
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

const PAPER_TYPE = ['enquirer', 'times'];
let genPaper = async function (req, res, next) {
    let token = req.headers['x-whitman-session-token'], email = req.body.email;
    let user = await UserController.checkToken(req, res, token, email);
    let type = req.body.type;
    if (!type || PAPER_TYPE.indexOf(type) === -1) {
        return res.status(400).send(new WhitmanError(WhitmanError.INVALID_PAPER_TYPE, `Invalid paper type ${type}.`));
    }
    let context = user.context;
    if (!context) {
        return res.status(400).send(new WhitmanError(WhitmanError.EMPTY_CONTEXT, 'Empty user context.'));
    }
    // console.log(new Date(), 'context', context);
    let paper;
    let isWin = /^win/.test(process.platform);
    console.log('isWin', isWin);
    try {
        let filePath = isWin ? path.join('assets', type, `${type}.pug`) : path.join('bin', 'assets', type, `${type}.pug`);
        console.log('filePath', filePath);
        paper = pug.renderFile(filePath, context);
    } catch (error) {
        console.error(new Date(), 'NewsGenController.genPaper failed (render)', error);
        res.status(400);
        return res.send(new WhitmanError(WhitmanError.RENDER_PAPER_FAILED, 'Rendering failed.'));
    }
    try {
        let filename = isWin ? path.join('assets', type, `${email}.html`) : path.join('bin', 'assets', type, `${email}.html`);
        let resourcePath = isWin ? path.join('assets', type) : path.join('bin', 'assets', type);
        console.log('resourcePath', resourcePath);
        await writeFilePromise(filename, paper);
        await transHtmlToPdf(filename, resourcePath, email, type);
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