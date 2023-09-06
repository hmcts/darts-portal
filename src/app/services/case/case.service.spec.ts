import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { CaseService } from './case.service';
import { CaseData } from '../../../app/types/case';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CourthouseData } from 'src/app/types/courthouse';
import { CaseFile } from 'src/app/types/case-file';
import { HearingData } from 'src/app/types/hearing';
import { Component } from '@angular/core';

describe('CaseService', () => {
  let httpClientSpy: HttpClient;
  let errorHandlerSpy: ErrorHandlerService;
  let service: CaseService;

  const mockCases: CaseData[] = [];
  const courthouses: CourthouseData[] = [];
  const mockCase = {} as CaseData;

  const mockCaseFile: Observable<CaseFile> = of({
    case_id: 1,
    courthouse: 'Swansea',
    case_number: 'CASE1001',
    defendants: ['Defendant Dave', 'Defendant Debbie'],
    judges: ['Judge Judy', 'Judge Jones'],
    prosecutors: ['Polly Prosecutor'],
    defenders: ['Derek Defender'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    retain_until: '2023-08-10T11:23:24.858Z',
  });

  const mockSingleCaseTwoHearings: Observable<HearingData[]> = of([
    {
      id: 1,
      date: '2023-09-01',
      judges: ['HHJ M. Hussain KC'],
      courtroom: '3',
      transcript_count: 1,
    },
  ]);

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

  describe('#getCaseFile', () => {
    it('should return value from observable', async () => {
      jest.spyOn(service, 'getCaseFile').mockReturnValue(mockCaseFile);

      const returnValue = service.getCaseFile(1);
      expect(returnValue).toBe(mockCaseFile);
    });
  });

  describe('#getCaseHearings', () => {
    it('should return value from observable', async () => {
      jest.spyOn(service, 'getCaseHearings').mockReturnValue(mockSingleCaseTwoHearings);

      service.getCaseHearings(1).subscribe((value) => {
        console.log(value);
        expect(value).toBe(mockSingleCaseTwoHearings);
      });
    });
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
      service.getCasesAdvanced('zzzz').subscribe(
        (result: CaseData[]) => {
          if (result) {
            cases = cases.concat(result);
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
