import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsComponent],
    });
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    component.tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set active tab to the first tab if not provided', () => {
    fixture.detectChanges();

    expect(component.activeTab).toEqual('Tab 1');
  });

  it('should set active tab to provided value if provided', () => {
    component.activeTab = 'Tab 2';

    fixture.detectChanges();

    expect(component.activeTab).toEqual('Tab 2');
  });

  it('should emit tab change event on tab click', () => {
    const spy = jest.spyOn(component.tabChange, 'emit');
    const tabToClick = 'Tab 2';

    fixture.detectChanges();

    component.onTabClick(new Event('click'), tabToClick);

    expect(component.activeTab).toEqual(tabToClick);
    expect(spy).toHaveBeenCalledWith(tabToClick);
  });
});
