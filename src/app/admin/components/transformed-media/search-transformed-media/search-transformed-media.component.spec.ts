import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTransformedMediaComponent } from './search-transformed-media.component';

describe('SearchTransformedMediaComponent', () => {
  let component: SearchTransformedMediaComponent;
  let fixture: ComponentFixture<SearchTransformedMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTransformedMediaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTransformedMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
