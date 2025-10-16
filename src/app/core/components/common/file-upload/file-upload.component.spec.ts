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

  it('valid file: calls onChange with file, onTouched, and clears isInvalid', () => {
    const file = new File([], 'test.doc'); // allowed by default .doc,.docx
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');

    component.isInvalid = true; // simulate prior error
    component.onFileChange([file]);

    expect(onChangeSpy).toHaveBeenCalledWith(file);
    expect(onTouchedSpy).toHaveBeenCalled();
    expect(component.isInvalid).toBe(false);
  });

  it('invalid file: clears input, sets error, sets isInvalid, calls onChange(null)', () => {
    const file = new File([], 'bad.txt'); // not allowed
    const fileInput = { value: 'bad.txt' } as unknown as HTMLInputElement;

    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');

    component.errorMessage = '';
    component.allowedFileTypes = '.doc,.docx';

    component.onFileChange([file], fileInput);

    expect(fileInput.value).toBe('');
    expect(component.isInvalid).toBe(true);
    expect(onChangeSpy).toHaveBeenCalledWith(null);
    expect(onTouchedSpy).toHaveBeenCalled();
    expect(component.errorMessage).toBe(`Invalid file type. Allowed types are ${component.allowedFileTypes}`);
  });

  it('invalid file: does not overwrite a custom errorMessage', () => {
    const file = new File([], 'bad.txt');
    const fileInput = { value: 'bad.txt' } as unknown as HTMLInputElement;

    const customMsg = 'Only Word documents are allowed.';
    component.errorMessage = customMsg;

    component.onFileChange([file], fileInput);

    expect(component.isInvalid).toBe(true);
    expect(component.errorMessage).toBe(customMsg);
  });

  it('onFileRemove: clears the input and propagates null', () => {
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');

    const fileInput = { value: 'something.doc' } as unknown as HTMLInputElement;

    component.onFileRemove(fileInput);

    expect(fileInput.value).toBe('');
    expect(onChangeSpy).toHaveBeenCalledWith(null);
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('valid .pdf with extended allow list passes validation and updates the value', () => {
    component.allowedFileTypes = '.txt,.dot,.dotx,.doc,.docx,.pdf,.rtf,.zip,.odt';
    const pdf = new File([], 'document.pdf');

    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');

    component.isInvalid = true; // simulate previous error state
    component.onFileChange([pdf]);

    expect(onChangeSpy).toHaveBeenCalledWith(pdf);
    expect(onTouchedSpy).toHaveBeenCalled();
    expect(component.isInvalid).toBe(false);
  });
});
