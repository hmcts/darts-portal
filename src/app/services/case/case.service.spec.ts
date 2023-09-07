import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { CaseService } from './case.service';
import { CaseData } from '../../../app/types/case';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CourthouseData } from 'src/app/types/courthouse';
import { CaseFile } from 'src/app/types/case-file';
import { HearingData } from 'src/app/types/hearing';

describe('CaseService', () => {
  let httpClientSpy: HttpClient;
  let errorHandlerSpy: ErrorHandlerService;
  let service: CaseService;

  const mockCases: CaseData[] = [];
  const courthouses: CourthouseData[] = [];

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

  const mockCaseHearings: Observable<HearingData[]> = of([
    {
      id: 1,
      date: '2023-09-01',
      judges: ['HHJ M. Hussain KC'],
      courtroom: '3',
      transcript_count: 1,
    },
    {
      id: 2,
      date: '2024-09-01',
      judges: ['HHJ M. David KC'],
      courtroom: '9',
      transcript_count: 300,
    },
  ]);

  const mockSingleHearing: Observable<HearingData> = of({
    id: 2,
    date: '2024-09-01',
    judges: ['HHJ M. David KC'],
    courtroom: '9',
    transcript_count: 300,
  });

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

  describe('#getHearingById', () => {
    it('should return specific hearing off id', () => {
      jest.spyOn(service, 'getHearingById').mockReturnValue(mockSingleHearing);
      const hearing$ = service.getHearingById(1, 2);

      expect(hearing$).toEqual(mockSingleHearing);
    });
  });

  describe('#getCase', () => {
    it('should call the correct api url', () => {
      service.getCase(1);

      expect(httpClientSpy.get).toHaveBeenCalledWith('/api/cases/1');
    });

    it('should return value from an observable', () => {
      jest.spyOn(service, 'getCase').mockReturnValue(mockCaseFile);
      const caseFile$ = service.getCase(1);

      expect(caseFile$).toEqual(mockCaseFile);
    });
  });

  describe('#getCaseHearings', () => {
    it('should call the correct api url', () => {
      service.getCaseHearings(1);

      expect(httpClientSpy.get).toHaveBeenCalledWith('/api/cases/1/hearings');
    });

    it('should return value from an observable', () => {
      jest.spyOn(service, 'getCaseHearings').mockReturnValue(mockCaseHearings);
      const hearings$ = service.getCaseHearings(1);

      expect(hearings$).toEqual(mockCaseHearings);
    });
  });

  describe('#getCasesAdvanced', () => {
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
            expect(cases).toBeFalsy();
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
      service.getCasesAdvanced('C20220620001', 'Reading', '1', 'Judy', 'Dave', '', '', 'keyword').subscribe({
        next: (result: CaseData[]) => {
          if (result) {
            cases = result;
            expect(cases).toBeTruthy();
            expect(cases).toEqual(mockCases);
          }
        },
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
      service.getCourthouses().subscribe({
        next: (result: CourthouseData[]) => {
          if (result) {
            courts = result;
            expect(courts).toBeFalsy();
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

    it('should call the correct api url', () => {
      service.getCourthouses();

      expect(httpClientSpy.get).toHaveBeenCalledWith('/api/courthouses');
    });

    it('should run specific get case function and return mock case', () => {
      jest.spyOn(service, 'getCourthouses').mockReturnValue(of(courthouses));
      let courts: CourthouseData[];
      service.getCourthouses().subscribe({
        next: (result: CourthouseData[]) => {
          if (result) {
            courts = result;
            expect(courts).toBeTruthy();
            expect(courts).toEqual(courthouses);
          }
        },
      });
    });
  });
});
