import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukHeadingComponent } from './govuk-heading.component';

describe('GovukHeadingComponent', () => {
  let component: GovukHeadingComponent;
  let fixture: ComponentFixture<GovukHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
