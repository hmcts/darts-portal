import { TitleCasePipe } from '@angular/common';
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

export type AutoCompleteItem = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.scss',
})
export class AutoCompleteComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: AutoCompleteItem[] = [];
  @Input({ required: true }) dataType!: string;
  @Input() label = '';
  @Input() selectedData = '';
  @Input() isInvalid = false;
  @Input() showAllValues = false;
  @Input() errors: string[] = [];
  @Output() dataSelect = new EventEmitter<AutoCompleteItem | null>();
  @ViewChild('autocomplete') autocompleteContainer!: ElementRef<HTMLElement>;

  props: AccessibleAutocompleteProps | null = null;

  ngOnInit() {
    this.props = {
      id: this.dataType + '-autocomplete',
      source: [],
      name: this.dataType + '-autocomplete',
      showAllValues: this.showAllValues,
      onConfirm: (selectedName: string) => {
        // selectedName is populated on selecting an option but is undefined onBlur, so we need to grab the input value directly from the input
        const name =
          selectedName || (document.querySelector(`#${this.dataType}-autocomplete`) as HTMLInputElement).value;
        const selectedItem = this.data.find((d) => d.name === name) ?? null;
        this.dataSelect.emit(selectedItem);
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && !changes.data.isFirstChange()) {
      this.configureAutoComplete();
    }
  }

  ngAfterViewInit(): void {
    this.configureAutoComplete();
  }

  configureAutoComplete() {
    this.autocompleteContainer.nativeElement.innerHTML = '';

    if (this.props) {
      this.props.element = this.autocompleteContainer.nativeElement;
      this.props.source = this.data.map((item) => item.name);
      this.props.defaultValue = this.selectedData;
      accessibleAutocomplete(this.props);
    }
  }
}
