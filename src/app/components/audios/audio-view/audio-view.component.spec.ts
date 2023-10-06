import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AudioViewComponent } from './audio-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AudioViewComponent', () => {
  let component: AudioViewComponent;
  let fixture: ComponentFixture<AudioViewComponent>;

  const mockActivatedRoute = {
    snapshot: {
      params: {
        requestId: 111,
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioViewComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    });
    fixture = TestBed.createComponent(AudioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
