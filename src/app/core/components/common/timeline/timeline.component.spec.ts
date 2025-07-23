import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TimelineItem } from '@core-types/index';
import { DateTime } from 'luxon';
import { TimelineComponent } from './timeline.component';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  // 1 January 2021 at 12:00 AM
  const time = DateTime.fromISO('2021-01-01T00:00:00Z');

  const MOCK_TIMELINE_ITEMS: TimelineItem[] = [
    {
      dateTime: time,
      title: 'Title 1',
      descriptionLines: ['Description 1'],
      user: {
        id: 1,
        fullName: 'Gary Smith',
        emailAddress: 'gary@aol.com',
        isSystemUser: false,
      },
    },
    {
      dateTime: time,
      title: 'Title 2',
      descriptionLines: ['Description 2'],
      user: {
        id: 2,
        fullName: 'Max Payne',
        emailAddress: 'beans@toast.com',
        isSystemUser: true,
      },
    },
    {
      dateTime: time,
      title: 'Title 2',
      descriptionLines: ['Description 2'],
      //@ts-expect-error legacy data could be missing user
      user: null,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }, DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    component.items = MOCK_TIMELINE_ITEMS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders timeline items', () => {
    const timelineItems = fixture.debugElement.queryAll(By.css('.moj-timeline__item'));

    MOCK_TIMELINE_ITEMS.forEach((item, i) => {
      const itemElement = timelineItems[i];
      const titleElement = itemElement.query(By.css('.moj-timeline__title')).nativeElement;
      const descriptionElement = itemElement.query(By.css('.moj-timeline__description')).nativeElement;
      const userElement = itemElement.query(By.css('.moj-timeline__byline'))?.nativeElement;
      const dateTimeElement = itemElement.query(By.css('.moj-timeline__date')).nativeElement;

      expect(titleElement.textContent).toContain(item.title);
      expect(descriptionElement.textContent).toContain(item.descriptionLines[0]);
      if (item.user !== null) {
        if (item.user.isSystemUser) {
          expect(userElement.textContent).toContain(item.user.fullName);
        } else {
          expect(userElement.textContent).toContain(item.user.fullName);
          expect(userElement.textContent).toContain(item.user.emailAddress);
        }
      } else {
        expect(userElement).toBeUndefined();
      }
      expect(dateTimeElement.textContent).toContain('1 January 2021 at 12:00 AM');
    });
  });

  it(`renders ${MOCK_TIMELINE_ITEMS.length} items`, () => {
    const timelineItems = fixture.debugElement.queryAll(By.css('.moj-timeline__item'));
    expect(timelineItems.length).toBe(MOCK_TIMELINE_ITEMS.length);
  });

  it('links to user record for non-system user', () => {
    const timelineItems = fixture.debugElement.queryAll(By.css('.moj-timeline__item'));
    const firstItem = timelineItems[0];
    const firstItemUserLink = firstItem.query(By.css('.user-link'));
    expect(firstItemUserLink.nativeElement.getAttribute('href')).toBe('/admin/users/1');
  });

  it('does not link to user record for system user', () => {
    const timelineItems = fixture.debugElement.queryAll(By.css('.moj-timeline__item'));
    const secondItem = timelineItems[1];
    const userElement = secondItem.query(By.css('.moj-timeline__byline'))?.nativeElement;
    const secondItemUserLink = secondItem.query(By.css('.user-link'));
    expect(secondItemUserLink).toBeNull();
    expect(userElement.textContent).toContain('Max Payne');
  });
});
