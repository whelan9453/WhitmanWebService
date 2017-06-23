let express = require('express');
let router = express.Router();
let UserController = require('../controllers/UserController');

router.post('/createUser', UserController.createUser);
router.post('/getUserInfo', UserController.getUserInfo);
module.exports = router;