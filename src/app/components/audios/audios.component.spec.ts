import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AudiosComponent } from './audios.component';

describe('AudiosComponent', () => {
  let component: AudiosComponent;
  let fixture: ComponentFixture<AudiosComponent>;

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: { userId: 123 }
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiosComponent, RouterTestingModule, HttpClientTestingModule],
      providers:[
        DatePipe, 
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(AudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
