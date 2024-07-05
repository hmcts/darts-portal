import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseHearingsTableComponent } from './case-hearings-table.component';

describe('CaseHearingsTableComponent', () => {
  let component: CaseHearingsTableComponent;
  let fixture: ComponentFixture<CaseHearingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseHearingsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseHearingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
