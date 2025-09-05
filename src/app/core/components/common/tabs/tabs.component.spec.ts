import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabDirective } from '@directives/tab.directive';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { TabsComponent } from './tabs.component';

class FakeActiveTabService {
  private state = signal<Record<string, string>>({});
  activeTabs = this.state.asReadonly();

  setActiveTab(screenId: string, tabName: string) {
    this.state.update((s) => ({ ...s, [screenId]: tabName }));
  }
  clearActiveTab(screenId: string) {
    this.state.update((s) => {
      const { [screenId]: _drop, ...rest } = s;
      return rest;
    });
  }
}

@Component({
  template: `
    <app-tabs [screenId]="screenId" [routedTabs]="routedTabs" [default]="initial" (tabChange)="onTabChange($event)">
      <div *tab="'Tab 1'">Content for Tab 1</div>
      <div *tab="'Tab 2'">Content for Tab 2</div>
      <div *tab="'Tab 3'; screenReaderText: 'text for screen reader'">Content for Tab 3</div>
    </app-tabs>
  `,
  standalone: true,
  imports: [TabsComponent, TabDirective],
})
class TestHostComponent {
  screenId?: string;
  routedTabs = false;
  initial = '';
  lastChange?: { name: string };
  onTabChange(ev: { name: string }) {
    this.lastChange = ev;
  }
}

describe('TabsComponent', () => {
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TabsComponent;
  let service: FakeActiveTabService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TabsComponent, TabDirective],
      providers: [{ provide: ActiveTabService, useClass: FakeActiveTabService }],
    }).compileComponents();

    service = TestBed.inject(ActiveTabService) as unknown as FakeActiveTabService;
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges(); // initial CD
    fixture.detectChanges(); // contentChildren settled, ngAfterContentInit ran
    component = fixture.debugElement.query(By.directive(TabsComponent)).componentInstance;
  });

  const navLinks = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.moj-sub-navigation__link')) as HTMLAnchorElement[];
  const renderedText = () => (fixture.nativeElement.querySelector('.tab-container')?.textContent ?? '').trim();

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('selects first tab on init when no default/persisted value', () => {
    expect(renderedText()).toBe('Content for Tab 1');
  });

  it('respects [default] input when provided (and no persisted value)', () => {
    // Recreate with a default
    fixture.destroy();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    host.initial = 'Tab 2';
    fixture.detectChanges();
    fixture.detectChanges();

    expect(renderedText()).toBe('Content for Tab 2');
  });

  it('switches content when a tab is clicked (normal mode)', () => {
    navLinks()[1].click(); // Tab 2
    fixture.detectChanges();
    fixture.detectChanges();

    expect(renderedText()).toBe('Content for Tab 2');
  });

  it('emits tabChange when a tab is clicked', () => {
    const emitSpy = jest.spyOn(component.tabChange, 'emit');
    navLinks()[1].click();
    fixture.detectChanges();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    expect(host.lastChange?.name).toBe('Tab 2');
  });

  it('injects screen reader text into the tab link', () => {
    const third = navLinks()[2];
    expect(third.innerHTML.includes('<span class="govuk-visually-hidden">text for screen reader</span>')).toBe(true);
  });

  it('persists selection when screenId is provided', () => {
    // Recreate with a screenId
    fixture.destroy();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    host.screenId = 'screen-a';
    fixture.detectChanges();
    fixture.detectChanges();

    // Click Tab 3
    navLinks()[2].click();
    fixture.detectChanges();
    fixture.detectChanges();

    expect(renderedText()).toBe('Content for Tab 3');
    const state: Record<string, string> = service.activeTabs();
    expect(state['screen-a']).toBe('Tab 3');
  });

  it('restores a previously persisted tab for the given screenId', () => {
    // Seed persistence BEFORE creating the component
    service.setActiveTab('screen-b', 'Tab 2');

    fixture.destroy();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    host.screenId = 'screen-b';
    fixture.detectChanges();
    fixture.detectChanges();

    expect(renderedText()).toBe('Content for Tab 2');
  });

  it('in routedTabs mode: emits but does not switch/persist on click', () => {
    // Recreate in routed mode with screenId
    fixture.destroy();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    host.screenId = 'screen-c';
    host.routedTabs = true;
    fixture.detectChanges();
    fixture.detectChanges();

    const cmp = fixture.debugElement.query(By.directive(TabsComponent)).componentInstance as TabsComponent;
    const emitSpy = jest.spyOn(cmp.tabChange, 'emit');

    // Click Tab 2
    navLinks()[1].click();
    fixture.detectChanges();
    fixture.detectChanges();

    // Still showing first (parent handles navigation)
    expect(renderedText()).toBe('Content for Tab 1');
    expect(emitSpy).toHaveBeenCalled();

    // Only initial persistence should exist
    const state: Record<string, string> = service.activeTabs();
    expect(state['screen-c']).toBe('Tab 1');
  });
});
