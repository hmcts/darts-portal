import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onChange and onTouched when onFileChange is called', () => {
    const files: File[] = [new File([], 'test.txt')];
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');

    component.onFileChange(files);

    expect(onChangeSpy).toHaveBeenCalledWith(files[0]);
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should clear file input value and call onFileChange with an empty array when onFileRemove is called', () => {
    const fileInput = document.createElement('input');
    fileInput.value = 'test.txt';
    const onFileChangeSpy = jest.spyOn(component, 'onFileChange');

    component.onFileRemove(fileInput);

    expect(fileInput.value).toBe('');
    expect(onFileChangeSpy).toHaveBeenCalledWith([]);
  });
});
