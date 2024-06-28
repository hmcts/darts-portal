import * as express from 'express';
import { Request, Response, Router } from 'express';
import path from 'path';
import config from 'config';

export function init(): Router {
  const router = express.Router();

  router.get('/annotations/template', (req: Request, res: Response) => {
    const oneOfRequiredRoles: string[] = ['JUDICIARY', 'SUPER_ADMIN'];
    const userRoles = req?.session?.securityToken?.userState?.roles?.map((role) => role.roleName);

    if (!userRoles?.some((role) => oneOfRequiredRoles.includes(role))) {
      // If user does not have Judge or Admin role, return 404
      res.sendStatus(404);
      return;
    }

    // handle the differing locations of the downloads directory when building
    if (config.get('node-env') === 'development') {
      res.sendFile(path.join(__dirname, '../downloads', 'AnnotationsTemplateExample.docx'));
    } else {
      res.sendFile(path.join(__dirname, '../../downloads', 'AnnotationsTemplateExample.docx'));
    }
  });

  return router;
}
