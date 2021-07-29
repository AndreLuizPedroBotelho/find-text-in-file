const express = require('express');
const services = require('./services');

const router = express.Router();

router.get('/', services.findInFile);
router.get('/download/:urlFile', services.downloadFile);

module.exports = router;