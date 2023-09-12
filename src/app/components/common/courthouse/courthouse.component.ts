import { CourthouseData } from 'src/app/types/courthouse';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import accessibleAutocomplete, { AccessibleAutocompleteProps } from 'accessible-autocomplete';

@Component({
  selector: 'app-courthouse-field',
  standalone: true,
  imports: [NgIf],
  templateUrl: './courthouse.component.html',
  styleUrls: ['./courthouse.component.scss'],
})
export class CourthouseComponent implements AfterViewInit {
  @ViewChild('courthouseAutocomplete') autocompleteContainer!: ElementRef<HTMLElement>;

  @Input() courthouses: CourthouseData[] = [];
  @Input() isInvalid = false;
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

  ngAfterViewInit(): void {
    if (this.courthouses.length) {
      this.props.element = this.autocompleteContainer.nativeElement as HTMLElement;
      this.props.source = this.courthouses.map((ch) => ch.courthouse_name);
      accessibleAutocomplete(this.props);
    }
  }
}
