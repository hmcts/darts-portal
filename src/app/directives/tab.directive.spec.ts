import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabDirective } from './tab.directive';

@Component({
  template: `
    <ng-template [tab]="'Test Tab'">Tab Content</ng-template>
  `,
})
class TestComponent {
  @ViewChild(TemplateRef, { static: true }) tabTemplate!: TemplateRef<any>;
}

describe('TabDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabDirective, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    const directive = new TabDirective();
    expect(directive).toBeTruthy();
  });

  it('should have a name input', () => {
    const directive = new TabDirective();
    directive.name = 'Test Tab';
    expect(directive.name).toBe('Test Tab');
  });

  it('should create an instance using TestBed', () => {
    fixture.detectChanges();
    const tabDirective = fixture.debugElement.nativeElement.querySelector('ng-template').injector.get(TabDirective);
    expect(tabDirective).toBeTruthy();
    expect(tabDirective.name).toBe('Test Tab');
  });
});