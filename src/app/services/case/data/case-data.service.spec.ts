import { TestBed } from '@angular/core/testing';

import { CaseDataService } from './case-data.service';
import { HearingData } from 'src/app/types/hearing';
import { CaseData } from 'src/app/types/case';

describe('CaseDataService', () => {
  let service: CaseDataService;
  const cd = { case_id: 1, case_number: '12345', courthouse: 'Reading', judges: ['Judy'] } as CaseData;
  const hd = [
    { id: 1, date: '2023-02-21', judges: ['Joseph', 'Judy'], courtroom: '3', transcript_count: 99 },
    { id: 2, date: '2023-03-21', judges: ['Joseph', 'Kennedy'], courtroom: '1', transcript_count: 12 },
  ] as HearingData[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('set and get functions', () => {
    it('should return correct values for case', () => {
      service.setCase(cd);
      expect(service.getCase()).toEqual(cd);
    });

    it('should return correct values for hearing', () => {
      service.setHearings(hd);
      expect(service.getHearings()).toEqual(hd);
    });

    it('should return correct values for hearing by id', () => {
      service.setHearings(hd);
      expect(service.getHearingById(1)).toEqual(hd[0]);
    });

    it('should return correct values for hearing by id and hearings passed in', () => {
      service.setHearings(hd);
      expect(service.getHearingById(2, hd)).toEqual(hd[1]);
    });
  });
});
