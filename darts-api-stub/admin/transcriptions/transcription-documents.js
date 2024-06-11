const router = require('express').Router();
const { DateTime } = require('luxon');

const documents = [
  {
    transcription_document_id: 0,
    transcription_id: 0,
    case: {
      id: 0,
      case_number: 'C0001',
    },
    courthouse: {
      id: 0,
      display_name: 'Cardiff',
    },
    hearing: {
      id: 0,
      hearing_date: '2021-01-01',
    },
    is_manual_transcription: true,
    is_hidden: false,
  },
  {
    transcription_document_id: 1,
    transcription_id: 1,
    case: {
      id: 1,
      case_number: 'C0002',
    },
    courthouse: {
      id: 1,
      display_name: 'Swansea',
    },
    hearing: {
      id: 1,
      hearing_date: '2022-02-02',
    },
    is_manual_transcription: false,
    is_hidden: false,
  },
  {
    transcription_document_id: 2,
    transcription_id: 2,
    case: {
      id: 2,
      case_number: 'C0003',
    },
    courthouse: {
      id: 2,
      display_name: 'Newport',
    },
    hearing: {
      id: 2,
      hearing_date: '2023-03-03',
    },
    is_manual_transcription: true,
    is_hidden: true,
  },
];

router.post('/search', (req, res) => {
  const { case_number } = req.body;
  if (case_number) {
    const filteredDocuments = documents.filter((document) => document.case.case_number === case_number);
    res.send(filteredDocuments);
    return;
  }

  res.send(documents);
});

router.get('/:transcription_document_id', (req, res) => {
  res.send({
    transcription_document_id: 123,
    transcription_id: 456,
    file_type: 'DOC',
    file_name: 'caseid_courthouse_filename.doc',
    file_size_bytes: 3145728,
    uploaded_at: '2008-05-18T15:00:00Z',
    uploaded_by: 3,
    is_hidden: false,
  });
});

router.post('/:transcription_document_id/hide', (req, res) => {
  const body = req.body;

  const response = {
    id: 0,
    is_hidden: true,
    admin_action: {
      id: 0,
      reason_id: body.admin_action.reason_id,
      hidden_by_id: 0,
      hidden_at: DateTime.now().toISO(),
      is_marked_for_manual_deletion: false,
      marked_for_manual_deletion_by_id: 0,
      marked_for_manual_deletion_at: DateTime.now().toISO(),
      ticket_reference: body.admin_action.ticket_reference,
      comments: body.admin_action.comments,
    },
  };

  res.send(response);
});

module.exports = router;
