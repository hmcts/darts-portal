import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeeMoreListComponent } from './see-more-list.component';

describe('SeeMoreListComponent', () => {
  let component: SeeMoreListComponent;
  let fixture: ComponentFixture<SeeMoreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeMoreListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeeMoreListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle empty items array', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    expect(component.uniqueItems()).toEqual([]);
    expect(component.visibleItems()).toEqual([]);
    expect(component.hasExtra()).toBe(false);
  });

  it('should handle fewer than limit items', () => {
    fixture.componentRef.setInput('items', ['Alice', 'Bob']);
    fixture.componentRef.setInput('limit', 3);
    fixture.detectChanges();

    expect(component.uniqueItems()).toEqual(['Alice', 'Bob']);
    expect(component.visibleItems()).toEqual(['Alice', 'Bob']);
    expect(component.hasExtra()).toBe(false);
  });

  it('should return correct visibleItems before toggle', () => {
    fixture.componentRef.setInput('items', ['Alice', 'Bob', 'Charlie']);
    fixture.componentRef.setInput('limit', 2);
    fixture.detectChanges();

    expect(component.visibleItems()).toEqual(['Alice', 'Bob']);
    expect(component.hasExtra()).toBe(true);
    expect(component.expanded()).toBe(false);
  });

  it('should return correct visibleItems after toggle', () => {
    fixture.componentRef.setInput('items', ['Alice', 'Bob', 'Charlie']);
    fixture.componentRef.setInput('limit', 2);
    fixture.detectChanges();

    component.toggle();
    expect(component.expanded()).toBe(true);
    expect(component.visibleItems()).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('should deduplicate items in uniqueItems', () => {
    fixture.componentRef.setInput('items', ['Alice', 'Bob', 'Alice']);
    fixture.detectChanges();

    expect(component.uniqueItems()).toEqual(['Alice', 'Bob']);
  });
});
