import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingRestrictionComponent } from './reporting-restriction.component';

describe('ReportingRestrictionComponent', () => {
  let component: ReportingRestrictionComponent;
  let fixture: ComponentFixture<ReportingRestrictionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReportingRestrictionComponent],
    });
    fixture = TestBed.createComponent(ReportingRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
