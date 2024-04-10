import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioCacheComponent } from './audio-cache.component';

describe('AudioCacheComponent', () => {
  let component: AudioCacheComponent;
  let fixture: ComponentFixture<AudioCacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioCacheComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
