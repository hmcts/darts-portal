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

  it('valid file: calls onChange with file, onTouched, clears local error, does not mutate isInvalid', () => {
    const file = new File([], 'test.doc'); // allowed by default .doc,.docx
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');

    component.isInvalid = true; // simulate parent-owned error flag
    component.onFileChange([file]);

    expect(onChangeSpy).toHaveBeenCalledWith(file);
    expect(onTouchedSpy).toHaveBeenCalled();
    expect(component.invalidExt).toBe(false);
    expect(component.extErrorMessage).toBe('');
    // child should NOT toggle parent-owned flag
    expect(component.isInvalid).toBe(true);
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
    expect(component.invalidExt).toBe(true);
    expect(component.extErrorMessage).toBe(`Invalid file type. Allowed types are ${component.allowedFileTypes}`);
    expect(onChangeSpy).toHaveBeenCalledWith(null);
    expect(onTouchedSpy).toHaveBeenCalled();
    expect(component.isInvalid).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('invalid file: keeps custom parent errorMessage unchanged and uses local extErrorMessage', () => {
    const file = new File([], 'bad.txt');
    const fileInputStub = { value: 'bad.txt' } as unknown as HTMLInputElement;

    const customMsg = 'Only Word documents are allowed.';
    component.errorMessage = customMsg; // parent-provided
    component.allowedFileTypes = '.doc,.docx';

    component.onFileChange([file], fileInputStub);

    expect(component.invalidExt).toBe(true);
    expect(component.extErrorMessage).toBe(`Invalid file type. Allowed types are ${component.allowedFileTypes}`);
    expect(component.errorMessage).toBe(customMsg); // parent message not overwritten
  });

  it('invalid file: keeps custom parent errorMessage unchanged while using local extErrorMessage', () => {
    const file = new File([], 'bad.txt');
    const fileInputStub = { value: 'bad.txt' } as unknown as HTMLInputElement;

    const customMsg = 'Only Word documents are allowed.';
    component.errorMessage = customMsg; // parent-provided
    component.allowedFileTypes = '.doc,.docx';

    component.onFileChange([file], fileInputStub);

    expect(component.invalidExt).toBe(true);
    expect(component.extErrorMessage).toBe(`Invalid file type. Allowed types are ${component.allowedFileTypes}`);
    expect(component.errorMessage).toBe(customMsg); // parent message not overwritten
    expect(component.isInvalid).toBe(false); // still not mutated
  });

  it('onFileRemove: clears the input, propagates null, and clears local error state', () => {
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');

    const fileInputStub = { value: 'something.doc' } as unknown as HTMLInputElement;

    // simulate previous local error
    component.invalidExt = true;
    component.extErrorMessage = 'Some error';

    component.onFileRemove(fileInputStub);

    expect(fileInputStub.value).toBe('');
    expect(onChangeSpy).toHaveBeenCalledWith(null);
    expect(onTouchedSpy).toHaveBeenCalled();
    expect(component.invalidExt).toBe(false);
    expect(component.extErrorMessage).toBe('');
  });

  it('valid .pdf with extended allow list passes validation and updates the value (local error stays clear)', () => {
    component.allowedFileTypes = '.txt,.dot,.dotx,.doc,.docx,.pdf,.rtf,.zip,.odt';
    const pdf = new File([], 'document.pdf');

    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');

    // simulate parent error present; child must not toggle it
    component.isInvalid = true;

    component.onFileChange([pdf]);

    expect(onChangeSpy).toHaveBeenCalledWith(pdf);
    expect(onTouchedSpy).toHaveBeenCalled();
    expect(component.invalidExt).toBe(false);
    expect(component.extErrorMessage).toBe('');
    expect(component.isInvalid).toBe(true); // still parent-owned
  });
});
