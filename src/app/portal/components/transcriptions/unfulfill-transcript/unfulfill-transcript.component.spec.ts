import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnfullfillTranscriptComponent } from './unfulfill-transcript.component';
import { FormControl } from '@angular/forms';
import { UnfulfilledReason } from 'src/app/admin/utils/unfulfilled-transcript.utils';

describe('UnfulfillTranscriptComponent', () => {
  let component: UnfullfillTranscriptComponent;
  let fixture: ComponentFixture<UnfullfillTranscriptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnfullfillTranscriptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnfullfillTranscriptComponent);
    component = fixture.componentInstance;
    component.reasonControl = new FormControl<UnfulfilledReason | '' | null>('');
    component.detailsControl = new FormControl<string>('', { nonNullable: true });

    component.isSubmitted = false;
    component.maxDetailsLength = 200;
    component.errorMessageFor = () => null;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleReasonChange', () => {
    it('should emit reasonChanged event with the current reasonControl value', () => {
      const reason = 'Audio is 1 second' as UnfulfilledReason;
      component.reasonControl.setValue(reason);

      const spy = jest.spyOn(component.reasonChanged, 'emit');

      component.handleReasonChange();

      expect(spy).toHaveBeenCalledWith(reason);
    });

    it('should clear detailsControl value when reasonControl value is not "other"', () => {
      component.reasonControl.setValue('Audio is 1 second' as UnfulfilledReason);
      component.detailsControl.setValue('Some details');

      component.handleReasonChange();

      expect(component.detailsControl.value).toBe('');
    });

    it('should not clear detailsControl value when reasonControl value is "other"', () => {
      component.reasonControl.setValue('other' as UnfulfilledReason);
      const details = 'Some specific details';
      component.detailsControl.setValue(details);

      component.handleReasonChange();

      expect(component.detailsControl.value).toBe(details);
    });
  });

  describe('errorMessageFor', () => {
    it('should return null by default', () => {
      expect(component.errorMessageFor('reason')).toBeNull();
      expect(component.errorMessageFor('details')).toBeNull();
    });

    it('should return custom error message when provided', () => {
      component.errorMessageFor = (field: 'reason' | 'details') => {
        if (field === 'reason') {
          return 'Reason is required';
        }
        if (field === 'details') {
          return 'Details are required';
        }
        return null;
      };

      expect(component.errorMessageFor('reason')).toBe('Reason is required');
      expect(component.errorMessageFor('details')).toBe('Details are required');
    });
  });

  describe('maxDetailsLength', () => {
    it('should default to 200', () => {
      expect(component.maxDetailsLength).toBe(200);
    });
  });

  describe('isSubmitted', () => {
    it('should default to false', () => {
      expect(component.isSubmitted).toBe(false);
    });
  });
});
