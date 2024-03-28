const express = require('express');
const { localArray } = require('../localArray');
const path = require('path');
const { userIdhasAnyRoles } = require('../users');
const { SUPER_ADMIN, JUDGE } = require('../roles');

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
  res.status(201).send({
    annotation_id: 1,
  });
});

const deleteAnnotationById = (annotationId) => {
  const annotations = localArray('annotations');
  const annotation = annotations.value.find((annotation) => annotation.annotation_id === parseInt(annotationId));
  if (!annotation) return null;
  else annotations.value.splice(annotations.value.indexOf(annotation), 1);
  // A stupid workaround that works
  annotations.value = annotations.value;
  return true;
};

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

router.delete('/:annotationId', (req, res) => {
  const { annotationId } = req.params;
  if (!userIdhasAnyRoles([SUPER_ADMIN, JUDGE], req.headers.user_id)) {
    res.status(403).send({
      detail: `You do not have permission to delete annotation with annotationId ${req.params?.annotationId}'.`,
    });
    return;
  }
  const annotationDeleted = deleteAnnotationById(annotationId);
  if (!annotationDeleted) {
    res.status(404).send({
      detail: `Annotation with annotationId '${annotationId}' does not exist'.`,
    });
    return;
  }
  // Otherwise return 204
  res.status(204).send();
});

module.exports = router;
