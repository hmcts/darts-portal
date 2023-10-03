import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabDirective } from '@directives/tab.directive';
import { TabsComponent } from './tabs.component';

@Component({
  template: `
    <app-tabs>
      <div *tab="'Tab 1'">Content for Tab 1</div>
      <div *tab="'Tab 2'">Content for Tab 2</div>
    </app-tabs>
  `,
  standalone: true,
  imports: [TabsComponent, TabDirective],
})
class TestHostComponent {}

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsComponent, TestHostComponent, TabDirective],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.debugElement.query(By.directive(TabsComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the first tab as the current tab after content initialization', () => {
    const firstTabContent = 'Content for Tab 1';
    const firstTabTemplate = component.tabs.first.template;

    expect(component.currentTab).toBe(firstTabTemplate);

    const renderedContent = fixture.nativeElement.querySelector('.tab-container').textContent.trim();
    expect(renderedContent).toBe(firstTabContent);
  });

  it('should switch tabs when a tab is clicked', () => {
    const secondTabContent = 'Content for Tab 2';
    const secondTabTemplate = component.tabs.get(1)?.template;

    const secondTabLink = fixture.nativeElement.querySelectorAll('.moj-sub-navigation__link')[1];
    secondTabLink.click();
    fixture.detectChanges();

    expect(component.currentTab).toBe(secondTabTemplate);

    const renderedContent = fixture.nativeElement.querySelector('.tab-container').textContent.trim();
    expect(renderedContent).toBe(secondTabContent);
  });
});
