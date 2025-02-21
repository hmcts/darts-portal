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
  {
    transcription_document_id: 3,
    transcription_id: 7,
    case: {
      id: 3,
      case_number: 'C0004',
    },
    courthouse: {
      id: 2,
      display_name: 'Newport',
    },
    hearing: {
      id: 2,
      hearing_date: '2015-06-15',
    },
    is_manual_transcription: true,
    is_hidden: false,
  },
];

const defaultTranscription = {
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

const markedForDeletion = [
  {
    transcription_document_id: 1,
    transcription: {
      id: 1,
    },
    case: {
      id: 1,
      case_number: 'C0001',
    },
    hearing: {
      id: 1,
      hearing_date: '2021-01-01',
    },
    courthouse: {
      id: 1,
      display_name: 'Cardiff',
    },
    courtroom: {
      id: 1,
      name: 'Courtroom 1',
    },
    admin_action: {
      id: 1,
      reason_id: 1,
      hidden_by_id: 1,
      hidden_at: '2024-06-02T13:00:00Z',
      is_marked_for_manual_deletion: true,
      marked_for_manual_deletion_by_id: 2,
      marked_for_manual_deletion_at: '2024-01-01T00:00:00Z',
      ticket_reference: 'REF123',
      comments: 'Lorem ipsum dolor sit comment',
    },
  },
  {
    transcription_document_id: 2,
    transcription: {
      id: 2,
    },
    case: {
      id: 2,
      case_number: 'C0002',
    },
    hearing: {
      id: 2,
      hearing_date: '2022-02-02',
    },
    courthouse: {
      id: 2,
      display_name: 'Swansea',
    },
    courtroom: {
      id: 2,
      name: 'Courtroom 2',
    },
    admin_action: {
      id: 2,
      reason_id: 2,
      hidden_by_id: 5,
      hidden_at: '2024-01-01T00:00:00Z',
      is_marked_for_manual_deletion: true,
      marked_for_manual_deletion_by_id: 2,
      marked_for_manual_deletion_at: '2024-01-01T00:00:00Z',
      ticket_reference: 'REF456',
      comments: 'Lorem ipsum dolor sit amet',
    },
  },
];

let transcription = { ...defaultTranscription };

let updatedDocs = [];

router.get('/reset', (req, res) => {
  transcription = { ...defaultTranscription };
  updatedDocs = [];

  res.sendStatus(202);
});

router.post('/search', (req, res) => {
  const { case_number } = req.body;
  if (case_number) {
    const filteredDocuments = documents.filter((document) => document.case.case_number === case_number);
    res.send(filteredDocuments);
    return;
  }

  res.send(documents);
});

router.post('/:id/approve-deletion', (req, res) => {
  const id = req.params.id;

  const index = markedForDeletion.findIndex((m) => m.transcription_document_id === parseInt(id));

  if (index !== -1) {
    markedForDeletion[index].admin_action.is_marked_for_manual_deletion = true;
    markedForDeletion[index].admin_action.marked_for_manual_deletion_by_id = 1;
    markedForDeletion[index].admin_action.marked_for_manual_deletion_at = DateTime.now().toISO();

    return res.send({ is_hidden: true, is_deleted: false, ...markedForDeletion[index] });
  }

  res.sendStatus(200);
});

router.get('/marked-for-deletion', (req, res) => {
  return res.send(markedForDeletion);
});

router.get('/:transcription_document_id', (req, res) => {
  const id = req.params.transcription_document_id;
  const document = documents.find((d) => d.transcription_document_id === parseInt(id, 10));

  if (id === '0' || id === '3') {
    transcription.is_hidden = false;
    transcription.admin_action.is_marked_for_manual_deletion = false;
  } else if ((id === '1' || id === '11') && !updatedDocs.includes(parseInt(id))) {
    //For hidden but not marked for deletion scenarios
    transcription.is_hidden = true;
    transcription.admin_action.reason_id = 5;
    transcription.admin_action.is_marked_for_manual_deletion = false;
    transcription.transcription_id = 1;
  } else if (updatedDocs.includes(parseInt(id))) {
    transcription.is_hidden = false;
    transcription.admin_action.reason_id = 5;
    transcription.admin_action.is_marked_for_manual_deletion = false;
  } else if (!updatedDocs.includes(transcription.id)) {
    transcription.is_hidden = true;
    transcription.admin_action.reason_id = 1;
    transcription.admin_action.is_marked_for_manual_deletion = true;
  }

  if (id === '2') {
    // for expired transcription
    return res.send({
      ...transcription,
      retain_until: '2022-02-02T09:00:00Z',
    });
  }

  if (document?.transcription_id) {
    return res.send({ ...transcription, transcription_id: document.transcription_id });
  }
  return res.send(transcription);
});

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
