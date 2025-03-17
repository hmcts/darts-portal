import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedCasesTableComponent } from './associated-cases-table.component';

describe('AssociatedCasesTableComponent', () => {
  let component: AssociatedCasesTableComponent;
  let fixture: ComponentFixture<AssociatedCasesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociatedCasesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociatedCasesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
