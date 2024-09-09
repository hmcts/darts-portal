import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';
import { ExpiredBannerComponent } from './expired-banner.component';

describe('ExpiredBannerComponent', () => {
  let component: ExpiredBannerComponent;
  let fixture: ComponentFixture<ExpiredBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredBannerComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpiredBannerComponent);
    fixture.componentRef.setInput('expiryDate', DateTime.now());
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
