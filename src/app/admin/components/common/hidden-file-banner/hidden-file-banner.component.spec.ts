import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenFileBannerComponent } from './hidden-file-banner.component';

describe('HiddenFileBannerComponent', () => {
  let component: HiddenFileBannerComponent;
  let fixture: ComponentFixture<HiddenFileBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiddenFileBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HiddenFileBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
