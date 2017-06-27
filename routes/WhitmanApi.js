let express = require('express');
let router = express.Router();
let UserController = require('../controllers/UserController');
let SecretController = require('../controllers/SecretController');

router.post('/createUser', UserController.createUser);
router.post('/getUserInfo', UserController.getUserInfo);
router.post('/updateUser', UserController.updateUser);
router.post('/getUploadToken', SecretController.getUpdateToken);
module.exports = router;