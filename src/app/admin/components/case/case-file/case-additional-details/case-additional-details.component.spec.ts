import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseAdditionalDetailsComponent } from './case-additional-details.component';

describe('CaseAdditionalDetailsComponent', () => {
  let component: CaseAdditionalDetailsComponent;
  let fixture: ComponentFixture<CaseAdditionalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseAdditionalDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseAdditionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
