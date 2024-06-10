import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHideOrDeleteSuccessComponent } from './file-hide-or-delete-success.component';

describe('FileHideOrDeleteSuccessComponent', () => {
  let component: FileHideOrDeleteSuccessComponent;
  let fixture: ComponentFixture<FileHideOrDeleteSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileHideOrDeleteSuccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileHideOrDeleteSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
