import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukBannerComponent } from './govuk-banner.component';

describe('SuccessBannerComponent', () => {
  let component: GovukBannerComponent;
  let fixture: ComponentFixture<GovukBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GovukBannerComponent],
    });
    fixture = TestBed.createComponent(GovukBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
