import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRetentionDateComponent } from './case-retention-date.component';

describe('CaseRetentionDateComponent', () => {
  let component: CaseRetentionDateComponent;
  let fixture: ComponentFixture<CaseRetentionDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseRetentionDateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseRetentionDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
