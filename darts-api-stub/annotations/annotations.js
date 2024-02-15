const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:annotationId/documents/:annotationDocumentId', (req, res) => {
    res.sendFile(path.join(__dirname, './download', 'TestDoc.docx'));
});

module.exports = router;
