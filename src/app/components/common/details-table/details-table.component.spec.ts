import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTableComponent } from './details-table.component';

describe('DetailsTableComponent', () => {
  let component: DetailsTableComponent<object>;
  let fixture: ComponentFixture<DetailsTableComponent<object>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
