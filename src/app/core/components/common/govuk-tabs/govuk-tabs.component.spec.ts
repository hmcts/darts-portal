import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TabsComponent } from '@common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { GovukTabsComponent } from './govuk-tabs.component';

@Component({
  template: `
    <app-tabs>
      <div *tab="'Tab x'">Content for Tab x</div>
      <div *tab="'Tab y'">Content for Tab y</div>
      <div *tab="'Tab z'; screenReaderText: 'text for screen reader'">Content for Tab z</div>
    </app-tabs>
  `,
  standalone: true,
  imports: [TabsComponent, TabDirective],
})
class TestHostComponent {}

describe('GovukTabsComponent', () => {
  let component: GovukTabsComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
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
});
