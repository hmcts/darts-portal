import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AudioFileDeleteComponent } from './audio-file-delete.component';

describe('AudioFileDeleteComponent', () => {
  let component: AudioFileDeleteComponent;
  let fixture: ComponentFixture<AudioFileDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioFileDeleteComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { isPermitted: true } } } },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioFileDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
