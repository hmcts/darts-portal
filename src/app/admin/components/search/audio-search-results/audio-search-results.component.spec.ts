import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSearchResultsComponent } from './audio-search-results.component';

describe('AudioSearchResultsComponent', () => {
  let component: AudioSearchResultsComponent;
  let fixture: ComponentFixture<AudioSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioSearchResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
