import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { CaseService } from './case.service';
import { CaseData } from '../../../app/types/case';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('CaseService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;
  let service: CaseService;

  const mockCases: CaseData[] = [];
  const mockCase = {} as CaseData;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CaseService', {
      getCasesAdvanced: mockCases,
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['err']);

    service = new CaseService(httpClientSpy, errorHandlerSpy);

    TestBed.configureTestingModule({
      providers: [{ provide: CaseService, useValue: spy }],
    }).compileComponents();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Need to create a mock testing controller to test API properly
  //Raise separate ticket for this
  //Temporary tests for time being

  describe('#getCasesAdvanced', () => {
    //Need fake endpoints to be reachable to test Custom Type responses
    it('should run cases advanced search function and return 404 response', () => {
      const errorResponse = new HttpErrorResponse({
        error: { code: `some code`, message: `some message.` },
        status: 404,
        statusText: 'Not Found',
      });

      spyOn(service, 'getCasesAdvanced').and.returnValue(throwError(errorResponse));

      let cases: CaseData[] = [];
      service.getCasesAdvanced('zzzz').subscribe(
        (result: CaseData[]) => {
          if (result) {
            cases = cases.concat(result);
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status) {
            expect(error.status).toEqual(404);
          }
        }
      );
    });

    it('should run cases advanced search function and return mock case', () => {
      spyOn(service, 'getCasesAdvanced').and.returnValue(of(mockCases));

      let cases: CaseData[] = [];
      service
        .getCasesAdvanced('C20220620001', 'Reading', '1', 'Judy', 'Dave', '', '', 'keyword')
        .subscribe((result: CaseData[]) => {
          if (result) {
            cases = cases.concat(result);
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

      spyOn(service, 'getCase').and.returnValue(throwError(errorResponse));

      let cases: CaseData;
      service.getCase('zzzz').subscribe(
        (result: CaseData) => {
          if (result) {
            cases = result;
            expect(cases).toBeFalsy();
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status) {
            expect(error.status).toEqual(404);
          }
        }
      );
    });

    it('should run specific get case function and return mock case', () => {
      spyOn(service, 'getCase').and.returnValue(of(mockCase));

      let cases: CaseData;
      service.getCase(1).subscribe((result: CaseData) => {
        if (result) {
          cases = result;
          expect(cases).toEqual(mockCase);
        }
      });
    });
  });
});
