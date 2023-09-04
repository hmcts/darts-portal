import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseFileComponent } from './case-file.component';

describe('CaseFileComponent', () => {
  let component: CaseFileComponent;
  let fixture: ComponentFixture<CaseFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseFileComponent],
    });
    fixture = TestBed.createComponent(CaseFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
