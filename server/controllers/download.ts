import * as express from 'express';
import { Router, Request, Response } from 'express';
import path from 'path';

export function init(): Router {
  const router = express.Router();

  router.get('/annotations/template', (req: Request, res: Response) => {
    const oneOfRequiredRoles: string[] = ['JUDGE', 'SUPER_ADMIN'];
    const userRoles = req?.session?.securityToken?.userState?.roles?.map((role) => role.roleName);

    if (!userRoles?.some((role) => oneOfRequiredRoles.includes(role))) {
      // If user does not have Judge or Admin role, return 404
      res.sendStatus(404);
      return;
    }

    res.sendFile(path.join(__dirname, '../downloads', 'AnnotationsTemplateExample.docx'));
  });

  return router;
}
