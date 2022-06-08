var express = require('express');
var router = express.Router();
const testController = require('../controllers/testController');

router.post('/seedDB', testController.seedDB);

module.exports = router;