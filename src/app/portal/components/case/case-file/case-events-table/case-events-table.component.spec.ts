import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseEventsTableComponent } from './case-events-table.component';

describe('CaseEventsTableComponent', () => {
  let component: CaseEventsTableComponent;
  let fixture: ComponentFixture<CaseEventsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseEventsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseEventsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
