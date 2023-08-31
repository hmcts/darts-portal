import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  constructor() {
    this._currentPage = 1;
  }

  private _currentPage: number;
  @Input() set currentPage(value) {
    this._currentPage = value;
    this.calculatePages();
  }
  get currentPage(): number {
    return this._currentPage;
  }

  @Input() total = 0;
  @Input() limit = 20;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];
  elipsedPages: (number | string)[] = [];
  ELIPSIS = '...';

  ngOnInit(): void {
    this.calculatePages();
  }

  onPageChanged($event: MouseEvent, page: number) {
    $event.preventDefault();
    this.changePage.emit(page);
  }

  private calculatePages() {
    const pagesCount = Math.ceil(this.total / this.limit);
    this.pages = this.range(1, pagesCount);
    this.elipsedPages = this.elipseSkippedPages(this.pages, this.currentPage);
  }

  private range(start: number, end: number): number[] {
    return [...Array(end).keys()].map((el) => el + start);
  }

  private elipseSkippedPages(pages: (string | number)[], currentPage: number): (string | number)[] {
    pages = [...pages];

    if (currentPage < pages.length - 2) {
      pages.splice(currentPage + 1, pages.length - currentPage - 2, this.ELIPSIS);
    }

    if (currentPage >= 5) {
      pages.splice(1, currentPage - 3, this.ELIPSIS);
    }
    console.log(pages);
    return [...pages];
  }
}
