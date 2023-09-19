import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import accessibleAutocomplete, { AccessibleAutocompleteProps } from 'accessible-autocomplete';
import { CourthouseData } from '@darts-types/index';

@Component({
  selector: 'app-courthouse-field',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './courthouse.component.html',
  styleUrls: ['./courthouse.component.scss'],
})
export class CourthouseComponent implements AfterViewInit, OnChanges {
  @ViewChild('courthouseAutocomplete') autocompleteContainer!: ElementRef<HTMLElement>;

  @Input() courthouses: CourthouseData[] = [];
  @Input() isInvalid = false;
  @Input() errors: string[] = [];
  @Output() courthouseSelect = new EventEmitter<string>();

  props: AccessibleAutocompleteProps = {
    id: 'courthouse',
    source: [],
    minLength: 1,
    name: 'courthouse',
    onConfirm: () => {
      // have to grab input value like this due to onConfirm(courthouse) emitting undefined onBlur
      const inputValue = (document.querySelector('input[name=courthouse]') as HTMLInputElement).value;
      this.courthouseSelect.emit(inputValue);
    },
  };

  ngOnChanges(): void {
    if (document.querySelector('input[name=courthouse]')) {
      if (this.isInvalid) {
        (document.querySelector('input[name=courthouse]') as HTMLInputElement).style.borderColor = '#d4351c';
      } else {
        (document.querySelector('input[name=courthouse]') as HTMLInputElement).style.borderColor = '';
      }
    }
  }

  reset() {
    (document.querySelector('input[name=courthouse]') as HTMLInputElement).value = '';
  }

  ngAfterViewInit(): void {
    if (this.courthouses.length) {
      this.props.element = this.autocompleteContainer.nativeElement as HTMLElement;
      this.props.source = this.courthouses.map((ch) => ch.courthouse_name);
      accessibleAutocomplete(this.props);
    }
  }
}
