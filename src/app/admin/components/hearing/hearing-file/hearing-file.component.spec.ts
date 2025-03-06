import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { HearingFileComponent } from './hearing-file.component';

describe('HearingFileComponent', () => {
  let component: HearingFileComponent;
  let fixture: ComponentFixture<HearingFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingFileComponent],
      providers: [DatePipe, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HearingFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
