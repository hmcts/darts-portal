import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCountTextareaComponent } from './character-count-textarea.component';

describe('CharacterCountTextareaComponent', () => {
  let component: CharacterCountTextareaComponent;
  let fixture: ComponentFixture<CharacterCountTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCountTextareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharacterCountTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
