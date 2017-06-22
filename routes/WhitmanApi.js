let express = require('express');
let router = express.Router();
let UserController = require('../controllers/UserController');

router.use('/', UserController.helloWorld);
module.exports = router;