import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedHearingsTableComponent } from './associated-hearings-table.component';

describe('AssociatedHearingsTableComponent', () => {
  let component: AssociatedHearingsTableComponent;
  let fixture: ComponentFixture<AssociatedHearingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociatedHearingsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociatedHearingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
