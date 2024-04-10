import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDeletionComponent } from './file-deletion.component';

describe('FileDeletionComponent', () => {
  let component: FileDeletionComponent;
  let fixture: ComponentFixture<FileDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDeletionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
