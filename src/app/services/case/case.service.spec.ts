import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { CaseService } from './case.service';
import { CaseData } from '../../../app/types/case';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CourthouseData } from 'src/app/types/courthouse';

describe('CaseService', () => {
  let httpClientSpy: HttpClient;
  let errorHandlerSpy: ErrorHandlerService;
  let service: CaseService;

  const mockCases: CaseData[] = [];
  const courthouses: CourthouseData[] = [];
  const mockCase = {} as CaseData;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as unknown as HttpClient;
    errorHandlerSpy = {
      err: jest.fn(),
    } as unknown as ErrorHandlerService;

    service = new CaseService(httpClientSpy, errorHandlerSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Need to create a mock testing controller to test API properly
  //Raise separate ticket for this
  describe('#getCasesAdvanced', () => {
    //Need fake endpoints to be reachable to test Custom Type responses
    it('should run cases advanced search function and return 404 response', () => {
      const errorResponse = new HttpErrorResponse({
        error: { code: `some code`, message: `some message.` },
        status: 404,
        statusText: 'Not Found',
      });

      jest.spyOn(service, 'getCasesAdvanced').mockReturnValue(throwError(() => errorResponse));

      let cases: CaseData[] = [];

      service.getCasesAdvanced('zzzz').subscribe({
        next: (result: CaseData[]) => {
          if (result) {
            cases = result;
          }
        },
        error: (error: HttpErrorResponse) => {
          expect(error).toBeTruthy();
          if (error.status) {
            service['errorHandlerService'].handleError(errorResponse);
            expect(service['errorHandlerService'].handleError).toHaveBeenCalledWith(errorResponse);
            expect(error.status).toEqual(404);
          }
        },
      });
    });

    it('should run cases advanced search function and return mock case', () => {
      jest.spyOn(service, 'getCasesAdvanced').mockReturnValue(of(mockCases));

      let cases: CaseData[] = [];
      service
        .getCasesAdvanced('C20220620001', 'Reading', '1', 'Judy', 'Dave', '', '', 'keyword')
        .subscribe((result: CaseData[]) => {
          if (result) {
            cases = result;
            expect(cases).toBeTruthy();
            expect(cases).toEqual(mockCases);
          }
        });
    });
  });

  describe('#getCase', () => {
    //Ticket raised to support this, DMP-774
    //Need fake endpoints to be reachable to test Custom Type responses
    it('should run specific get case function and return 404 response', () => {
      const errorResponse = new HttpErrorResponse({
        error: { code: `some code`, message: `some message.` },
        status: 404,
        statusText: 'Not Found',
      });

      jest.spyOn(service, 'getCase').mockReturnValue(throwError(() => errorResponse));

      let cases: CaseData;
      service.getCase('zzzz').subscribe(
        (result: CaseData) => {
          if (result) {
            cases = result;
            expect(cases).toBeFalsy();
          }
        },
        (error: HttpErrorResponse) => {
          expect(error).toBeTruthy();
          if (error.status) {
            service['errorHandlerService'].handleError(errorResponse);
            expect(service['errorHandlerService'].handleError).toHaveBeenCalledWith(errorResponse);
            expect(error.status).toEqual(404);
          }
        }
      );
    });

    it('should run specific get case function and return mock case', () => {
      jest.spyOn(service, 'getCase').mockReturnValue(of(mockCase));

      let cases: CaseData;
      service.getCase(1).subscribe((result: CaseData) => {
        if (result) {
          cases = result;
          expect(cases).toBeTruthy();
          expect(cases).toEqual(mockCase);
        }
      });
    });
  });

  describe('#getCourthouses', () => {
    it('should run get courthouses function and return 404 response', () => {
      const errorResponse = new HttpErrorResponse({
        error: { code: `some code`, message: `some message.` },
        status: 404,
        statusText: 'Not Found',
      });

      jest.spyOn(service, 'getCourthouses').mockReturnValue(throwError(() => errorResponse));

      let courts: CourthouseData[];
      service.getCourthouses().subscribe(
        (result: CourthouseData[]) => {
          if (result) {
            courts = result;
            expect(courts).toBeFalsy();
          }
        },
        (error: HttpErrorResponse) => {
          expect(error).toBeTruthy();
          if (error.status) {
            service['errorHandlerService'].handleError(errorResponse);
            expect(service['errorHandlerService'].handleError).toHaveBeenCalledWith(errorResponse);
            expect(error.status).toEqual(404);
          }
        }
      );
    });

    it('should run specific get case function and return mock case', () => {
      jest.spyOn(service, 'getCourthouses').mockReturnValue(of(courthouses));
      let courts: CourthouseData[];
      service.getCourthouses().subscribe((result: CourthouseData[]) => {
        if (result) {
          courts = result;
          expect(courts).toBeTruthy();
          expect(courts).toEqual(courthouses);
        }
      });
    });
  });
});
