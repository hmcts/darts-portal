const express = require('express');

const router = express.Router();

const mockTranscriptionDetails = {
  case_id: 1,
  case_number: 'C20220620001',
  courthouse: 'Swansea',
  defendants: ['Defendant Dave'],
  judges: ['HHJ M. Hussain KC	'],
  transcript_file_name: 'C20220620001_0.docx',
  hearing_date: '2023-11-08',
  urgency: 'Standard',
  request_type: 'Specified Times',
  transcription_start_ts: '2023-06-26T13:00:00Z',
  transcription_end_ts: '2023-06-26T16:00:00Z',
};

router.get('/types', (req, res) => {
  res.send([
    { trt_id: 1, description: 'Sentencing Remarks' },
    { trt_id: 2, description: 'Summing up (inc. verdict)' },
    { trt_id: 3, description: 'Antecedents' },
    { trt_id: 4, description: 'Argument and submission of ruling' },
    { trt_id: 5, description: 'Court log' },
    { trt_id: 6, description: 'Mitigation' },
    { trt_id: 7, description: 'Proceedings after verdict' },
    { trt_id: 8, description: 'Proposed opening of facts' },
    { trt_id: 9, description: 'Specified times' },
    { trt_id: 999, description: 'Other' },
  ]);
});

router.get('/urgencies', (req, res) => {
  res.send([
    { tru_id: 1, description: 'Overnight' },
    { tru_id: 2, description: '3 working days' },
    { tru_id: 3, description: '7 working days' },
    { tru_id: 4, description: '12 working days' },
  ]);
});

router.get('/:transcriptId', (req, res) => {
  switch (req.params.transcriptId) {
    case '1':
      res.status(200).send(mockTranscriptionDetails);
    default:
      const resBody104 = {
        type: 'CASE_104',
        title: 'The requested case cannot be found',
        status: 404,
      };
      res.status(404).send(resBody104);
  }
});

router.post('/', (req, res) => {
  res.send({ transcription_id: 123 });
});

module.exports = router;
