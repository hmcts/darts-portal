import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayButtonComponent } from './play-button.component';

describe('PlayButtonComponent', () => {
  let component: PlayButtonComponent;
  let fixture: ComponentFixture<PlayButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlayButtonComponent]
    });
    fixture = TestBed.createComponent(PlayButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
