import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabDirective } from './tab.directive';

@Component({
  standalone: true,
  imports: [TabDirective],
  template: `<ng-template [tab]="'Test Tab'" #tabRef>Tab Content</ng-template>`,
})
class TestComponent {
  @ViewChild(TabDirective) directiveInstance!: TabDirective;
  @ViewChild('tabRef', { static: true }) tabTemplate!: TemplateRef<unknown>;
}

describe('TabDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the directive instance via ViewChild', () => {
    expect(component.directiveInstance).toBeTruthy();
  });

  it('should have a name input equal to "Test Tab"', () => {
    expect(component.directiveInstance.name).toBe('Test Tab');
  });
});
