import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { SearchTransformedMediaComponent } from './search-transformed-media.component';

const mockTransformedMedia: TransformedMediaAdmin[] = [
  {
    id: 1,
    fileName: 'file-name',
    fileFormat: 'file-format',
    fileSizeBytes: 1234,
    mediaRequest: {
      id: 1,
      requestedAt: DateTime.fromISO('2020-01-01'),
      ownerUserId: 1,
      requestedByUserId: 1,
    },
    case: {
      id: 1,
      caseNumber: 'case-number',
    },
    courthouse: {
      id: 1,
      displayName: 'courthouse',
    },
    hearing: {
      id: 1,
      hearingDate: DateTime.fromISO('2020-01-01'),
    },
    lastAccessedAt: DateTime.fromISO('2020-01-01'),
  },
];

const mockUsers: User[] = [
  {
    id: 1,
    fullName: 'user-name',
  } as User,
];

describe('SearchTransformedMediaComponent', () => {
  let component: SearchTransformedMediaComponent;
  let fixture: ComponentFixture<SearchTransformedMediaComponent>;
  let fakeTransformedMediaService: Partial<TransformedMediaService>;
  let fakeUserAdminService: Partial<UserAdminService>;
  let fakeCourthouseService: Partial<CourthouseService>;

  beforeEach(async () => {
    fakeTransformedMediaService = {
      searchTransformedMedia: jest.fn().mockReturnValue(of(mockTransformedMedia)),
    };

    fakeUserAdminService = {
      getUsersById: jest.fn().mockReturnValue(of(mockUsers)),
    };

    fakeCourthouseService = {
      getCourthouses: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [SearchTransformedMediaComponent],
      providers: [
        { provide: TransformedMediaService, useValue: fakeTransformedMediaService },
        { provide: UserAdminService, useValue: fakeUserAdminService },
        { provide: CourthouseService, useValue: fakeCourthouseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTransformedMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearch', () => {
    it('should call transformedMediaService.searchTransformedMedia', () => {
      const searchTransformedMediaSpy = jest.spyOn(component.transformedMediaService, 'searchTransformedMedia');
      const formValues = {} as TransformedMediaSearchFormValues;

      component.onSearch(formValues);

      expect(searchTransformedMediaSpy).toHaveBeenCalledWith(formValues);
    });

    it('should call userService.getUsersById', () => {
      const getUsersByIdSpy = jest.spyOn(component.userService, 'getUsersById');

      component.onSearch({});

      expect(getUsersByIdSpy).toHaveBeenCalledWith([1]);
    });

    it('map results with user details', () => {
      component.onSearch({});

      expect(component.results()).toEqual([
        {
          ...mockTransformedMedia[0],
          mediaRequest: {
            ...mockTransformedMedia[0].mediaRequest,
            ownerUserName: mockUsers[0].fullName,
            requestedByName: mockUsers[0].fullName,
          },
        },
      ]);
    });

    it('set isSearchFormSubmitted to true', () => {
      component.onSearch({});
      expect(component.isSearchFormSubmitted()).toBe(true);
    });

    it('should navigate to the transcript page if only one result is returned', () => {
      jest.spyOn(component.router, 'navigate');
      component.onSearch({});
      expect(component.router.navigate).toHaveBeenCalledWith(['/admin/transformed-media', 1]);
    });
  });
});
