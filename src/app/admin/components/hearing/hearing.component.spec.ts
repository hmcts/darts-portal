import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { HearingComponent } from './hearing.component';

describe('HearingComponent', () => {
  let component: HearingComponent;
  let fixture: ComponentFixture<HearingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(HearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
