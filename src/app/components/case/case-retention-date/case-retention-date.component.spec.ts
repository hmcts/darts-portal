import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { CaseRetentionDateComponent } from './case-retention-date.component';

describe('CaseRetentionDateComponent', () => {
  let component: CaseRetentionDateComponent;
  let fixture: ComponentFixture<CaseRetentionDateComponent>;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        caseId: 1,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseRetentionDateComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }, { provide: DatePipe }],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseRetentionDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
