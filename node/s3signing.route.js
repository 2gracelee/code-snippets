const router = require('express').Router();
const filesController = require('../controllers/files.controller')

router.get('/get-signed-url', filesController.getSignedUrl);

module.exports = router;
