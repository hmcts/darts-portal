import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTranscriptsComponent } from './user-transcripts.component';

describe('UserTranscriptsComponent', () => {
  let component: UserTranscriptsComponent;
  let fixture: ComponentFixture<UserTranscriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTranscriptsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTranscriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
