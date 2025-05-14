import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { AudioRequestService } from '@services/audio-request/audio-request.service';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { TransformedMediaService, defaultFormValues } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { TransformedMediaRow } from '../transformed-media-search-results/transformed-media-search-results.component';
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

const mockSelectedMedia: TransformedMediaRow[] = [
  {
    id: 1,
    size: 1234,
  },
  {
    id: 2,
    size: 1234,
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
  let fakeAudioRequestService: Partial<AudioRequestService>;

  beforeEach(async () => {
    fakeAudioRequestService = {
      deleteTransformedMedia: jest.fn().mockReturnValue(of(null)),
    };

    fakeTransformedMediaService = {
      searchTransformedMedia: jest.fn().mockReturnValue(of(mockTransformedMedia)),
      isSearchFormSubmitted: signal<boolean>(false),
      searchResults: signal<TransformedMediaAdmin[]>([]),
      searchFormValues: signal<TransformedMediaSearchFormValues>(defaultFormValues),
      fetchNewResults: signal<boolean>(false),
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
        { provide: AudioRequestService, useValue: fakeAudioRequestService },
        provideHttpClient(),
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

      expect(component.transformedMediaService.searchResults()).toEqual([
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
      expect(component.transformedMediaService.isSearchFormSubmitted()).toBe(true);
    });

    it('should navigate to the transcript page if only one result is returned', () => {
      jest.spyOn(component.router, 'navigate');
      component.onSearch({});
      expect(component.router.navigate).toHaveBeenCalledWith(['/admin/transformed-media', 1]);
    });
  });

  describe('onDelete()', () => {
    it('should set isDeleting to true when media is selected', () => {
      component.selectedMedia.set(mockSelectedMedia);
      component.onDelete();
      expect(component.isDeleting()).toBe(true);
    });

    it('should not set isDeleting if no media is selected', () => {
      component.selectedMedia.set([]);
      component.onDelete();
      expect(component.isDeleting()).toBe(false);
    });
  });

  describe('onSelectedMediaChange()', () => {
    it('should update selectedMedia', () => {
      component.onSelectedMediaChange(mockSelectedMedia);
      expect(component.selectedMedia()).toEqual(mockSelectedMedia);
    });
  });

  describe('onDeleteConfirmed()', () => {
    it('should not proceed if no media is selected', () => {
      component.selectedMedia.set([]);
      component.onDeleteConfirmed();
      expect(fakeAudioRequestService.deleteTransformedMedia).not.toHaveBeenCalled();
    });

    it('should delete selected media and refresh search results', () => {
      jest.spyOn(component, 'onSearch');
      component.selectedMedia.set(mockSelectedMedia);

      component.onDeleteConfirmed();
      expect(fakeAudioRequestService.deleteTransformedMedia).toHaveBeenCalledTimes(2);
      expect(fakeAudioRequestService.deleteTransformedMedia).toHaveBeenCalledWith(1);
      expect(fakeAudioRequestService.deleteTransformedMedia).toHaveBeenCalledWith(2);
    });
  });

  describe('onDeleteCancelled()', () => {
    it('should set isDeleting to false', () => {
      component.isDeleting.set(true);
      component.onDeleteCancelled();
      expect(component.isDeleting()).toBe(false);
    });
  });
});
