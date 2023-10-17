import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbDirective } from './breadcrumb.directive';

@Component({
  imports: [BreadcrumbDirective],
  template: `
    <a *breadcrumb="['/test', 123]">Breadcrumb with link</a>
    <a *breadcrumb>Breadcrumb without link</a>
  `,
  standalone: true,
})
class TestComponent {
  @ViewChildren(BreadcrumbDirective) breadcrumbs!: QueryList<BreadcrumbDirective>;
}

describe('BreadcrumbDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, BreadcrumbDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('set link input', () => {
    const linkedBreadcrumb = component.breadcrumbs.first;
    expect(linkedBreadcrumb.link).toEqual(['/test', 123]);
  });

  it('set default link value when no link is provided', () => {
    const noLinkBreadcrumb = component.breadcrumbs.last;
    expect(noLinkBreadcrumb.link).toEqual(['.']);
  });
});
