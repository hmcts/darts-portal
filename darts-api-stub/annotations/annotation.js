const express = require('express');
const { localArray } = require('../localArray');
const path = require('path');

const router = express.Router();

const resBody104 = {
  type: 'CASE_104',
  title: 'The requested document cannot be found',
  status: 404,
};

const getAnnotationDocumentByAnnotationAndDocumentId = (annotationId, annotationDocumentId) => {
  const annotations = localArray('annotations');
  const annotation = annotations.value.find((annotation) => annotation.annotation_id === parseInt(annotationId));
  if (!annotation) return null;
  return annotation.annotation_documents.find(
    (document) => document.annotation_document_id === parseInt(annotationDocumentId)
  );
};

router.post('', (req, res) => {
  console.log(req.body);
  res.status(201).send({
    "annotation_id": 1
  });
});

// annotations stub data
router.get('/:annotationId/documents/:annotationDocumentId', (req, res) => {
  const document = getAnnotationDocumentByAnnotationAndDocumentId(
    req.params?.annotationId,
    req.params?.annotationDocumentId
  );
  if (!document) {
    res.status(404).send(resBody104);
    return;
  }
  const fileName = document.file_name;
  res.set('Content-Disposition', `attachment; filename="${fileName}"`);
  res.sendFile(path.join(__dirname, './docs', 'annotation.docx'));
});

module.exports = router;
