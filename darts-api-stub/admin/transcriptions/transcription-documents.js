const router = require('express').Router();
const { DateTime } = require('luxon');

const documents = [
  {
    transcription_document_id: 0,
    transcription_id: 0,
    is_manual_transcription: true,
    is_hidden: false,
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
    admin_action: {
      id: 1,
      reason_id: 1,
      hidden_by_id: 1,
      hidden_at: '2024-01-01T00:00:00Z',
      is_marked_for_manual_deletion: false,
      marked_for_manual_deletion_by_id: 0,
      marked_for_manual_deletion_at: '2024-01-01T00:00:00Z',
      ticket_reference: 'string',
      comments: 'string',
    },
  },
  {
    transcription_document_id: 1,
    transcription_id: 1,
    is_manual_transcription: false,
    is_hidden: false,
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

const transcription = {
  transcription_document_id: 123,
  transcription_id: 456,
  file_type: 'DOC',
  file_name: 'caseid_courthouse_filename.doc',
  file_size_bytes: 3145728,
  uploaded_at: '2008-05-18T15:00:00Z',
  uploaded_by: 3,
  retain_until: '2034-01-01T09:00:00Z',
  content_object_id: 'ABC12343211',
  checksum: '2AGSGAQ27277178AA',
  clip_id: '123112DDE',
  last_modified_at: '2024-01-01T13:52:00Z',
  last_modified_by: 1,
  is_hidden: false,
  admin_action: {
    id: 1,
    reason_id: 1,
    hidden_by_id: 1,
    hidden_at: '2024-01-01T07:10:00Z',
    is_marked_for_manual_deletion: false,
    marked_for_manual_deletion_by_id: 1,
    marked_for_manual_deletion_at: '2024-01-01T18:30:00Z',
    ticket_reference: 'Ticket Reference 1232',
    comments: 'This is a comment',
  },
};

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
  const id = req.params.transcription_document_id;

  if (id === '0') {
    transcription.is_hidden = false;
    transcription.admin_action.is_marked_for_manual_deletion = false;
  } else if (id === '1' && !updatedDocs.includes(parseInt(id))) {
    transcription.is_hidden = true;
    transcription.admin_action.is_marked_for_manual_deletion = false;
  } else if (updatedDocs.includes(parseInt(id))) {
    transcription.is_hidden = false;
    transcription.admin_action.is_marked_for_manual_deletion = false;
  } else if (!updatedDocs.includes(transcription.id)) {
    transcription.is_hidden = true;
    transcription.admin_action.is_marked_for_manual_deletion = true;
  }
  return res.send(transcription);
});

const updatedDocs = [];
router.post('/:transcription_document_id/hide', (req, res) => {
  const body = req.body;
  let response;

  if (body.is_hidden) {
    response = {
      id: 0,
      is_hidden: true,
      admin_action: {
        id: 0,
        reason_id: body.admin_action.reason_id,
        hidden_by_id: 0,
        hidden_at: DateTime.now().toISO(),
        is_marked_for_manual_deletion: false,
        marked_for_manual_deletion_by_id: 1,
        marked_for_manual_deletion_at: DateTime.now().toISO(),
        ticket_reference: body.admin_action.ticket_reference,
        comments: body.admin_action.comments,
      },
    };
  } else {
    transcription.is_hidden = false;
    transcription.is_deleted = false;
    transcription.admin_action.is_marked_for_manual_deletion = false;
    !updatedDocs.includes(parseInt(req.params.transcription_document_id)) &&
      updatedDocs.push(parseInt(req.params.transcription_document_id));

    response = {
      id: 0,
      is_hidden: false,
      is_deleted: false,
    };
  }

  res.send(response);
});

module.exports = router;
