const express = require('express');
const files = require('./services/files');

const router = express.Router();

router.get('/', files.findInFile);
router.get('/download/:urlFile', files.downloadFile);

module.exports = router;