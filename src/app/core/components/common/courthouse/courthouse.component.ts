import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import accessibleAutocomplete, { AccessibleAutocompleteProps } from 'accessible-autocomplete';

@Component({
  selector: 'app-courthouse-field',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './courthouse.component.html',
  styleUrls: ['./courthouse.component.scss'],
})
export class CourthouseComponent implements AfterViewInit, OnChanges, OnInit {
  @ViewChild('courthouseAutocomplete') autocompleteContainer!: ElementRef<HTMLElement>;

  @Input() courthouses: Courthouse[] = [];
  @Input() courthouse = '';
  @Input() label = 'Courthouse';
  @Input() isInvalid = false;
  @Input() showAllValues = true;
  @Input() errors: string[] = [];
  @Output() courthouseSelect = new EventEmitter<string>();

  props: AccessibleAutocompleteProps | null = null;

  ngOnInit(): void {
    this.props = {
      id: 'courthouse',
      source: [],
      minLength: 1,
      name: 'courthouse',
      showAllValues: this.showAllValues,
      onConfirm: () => {
        // have to grab input value like this due to onConfirm(courthouse) emitting undefined onBlur
        const inputValue = (document.querySelector('input[name=courthouse]') as HTMLInputElement).value;
        this.courthouseSelect.emit(inputValue);
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courthouse']?.currentValue === '') {
      this.reset();
    }

    if (document.querySelector('input[name=courthouse]')) {
      if (this.isInvalid) {
        (document.querySelector('input[name=courthouse]') as HTMLInputElement).style.borderColor = '#d4351c';
      } else {
        (document.querySelector('input[name=courthouse]') as HTMLInputElement).style.borderColor = '';
      }
    }
  }

  reset() {
    this.configureAutocomplete();
  }

  ngAfterViewInit(): void {
    this.configureAutocomplete();
  }

  configureAutocomplete() {
    if (this.courthouses.length && this.props) {
      this.autocompleteContainer.nativeElement.innerHTML = '';

      this.props.element = this.autocompleteContainer.nativeElement;
      this.props.source = this.courthouses.map((courthouse) => courthouse.displayName);
      this.props.defaultValue = this.courthouse;
      accessibleAutocomplete(this.props);
    }
  }
}
