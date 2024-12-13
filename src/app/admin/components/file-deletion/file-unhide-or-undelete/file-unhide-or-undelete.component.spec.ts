import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUnhideOrUndeleteComponent } from './file-unhide-or-undelete.component';

describe('FileUnhideOrUndeleteComponent', () => {
  let component: FileUnhideOrUndeleteComponent;
  let fixture: ComponentFixture<FileUnhideOrUndeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUnhideOrUndeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUnhideOrUndeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
