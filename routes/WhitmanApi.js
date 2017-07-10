let express = require('express');
let router = express.Router();
let UserController = require('../controllers/UserController');
let SecretController = require('../controllers/SecretController');
let NewsGenController = require('../controllers/NewsGenController');

router.post('/createUser', UserController.createUser);
router.post('/getUserInfo', UserController.getUserInfo);
router.post('/updateUserCtx', UserController.updateUserCtx);
router.post('/updateUserName', UserController.updateUserName);
router.post('/purgeUser', UserController.purgeUserCtx);
router.post('/getUploadToken', SecretController.getUpdateToken);
router.post('/genPaper', NewsGenController.genPaper);
module.exports = router;