import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabDirective } from './tab.directive';

@Component({
  template: ` <ng-template [tab]="'Test Tab'">Tab Content</ng-template> `,
  standalone: true,
})
class TestComponent {
  @ViewChild(TemplateRef, { static: true }) tabTemplate!: TemplateRef<unknown>;
}

describe('TabDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabDirective, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    const directive = new TabDirective(component.tabTemplate);
    expect(directive).toBeTruthy();
  });

  it('should have a name input', () => {
    const directive = new TabDirective(component.tabTemplate);
    directive.name = 'Test Tab';
    expect(directive.name).toBe('Test Tab');
  });
});
