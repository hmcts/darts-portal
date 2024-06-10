import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHideOrDeleteComponent } from './file-hide-or-delete.component';

describe('FileHideOrDeleteComponent', () => {
  let component: FileHideOrDeleteComponent;
  let fixture: ComponentFixture<FileHideOrDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileHideOrDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileHideOrDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
