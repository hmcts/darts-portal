// return stub data if enabled and response is mapped below
// this is strictly temporary to enable building screens with stub data on deployed environments
// should be removed onces all API endpoints are available
import config from 'config';
import * as express from 'express';
import { Request, Response, Router } from 'express';

// stubs

import { StubResponse } from '../stubs';

const STUB_ALLOWED = config.get('allowStubData') === 'true';

// create stub files and add to this array to stub data
const STUB_RESPONSES: StubResponse[] = [
  // include stubs here like below
  // ...eventMappings,
  // ...transformedMedia,
  // ...eventsStubResponses,
  // ...hearingsStubResponses,
];

function stubData(response: unknown, status: number) {
  return (req: Request, res: Response): void | Response<unknown, Record<string, unknown>> => {
    console.log(`Stubbed response for API endpoint: ${req.method.toUpperCase()} ${req.originalUrl}`);
    return res.status(status).json(response);
  };
}

export function init(): Router {
  const router = express.Router();
  if (STUB_ALLOWED) {
    STUB_RESPONSES.forEach((stub) => {
      router[stub.method](stub.path, (req: Request, res: Response) => {
        stubData(stub.response, stub.status)(req, res);
      });
    });
  }
  return router;
}
