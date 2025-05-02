import { AudioVersion } from '@admin-types/transformed-media/audio-version';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ShowVersionsComponent } from './show-versions.component';

describe('ShowVersionsComponent', () => {
  let component: ShowVersionsComponent;
  let fixture: ComponentFixture<ShowVersionsComponent>;
  let router: Router;
  let routerNavigateSpy: jest.SpyInstance;

  jest.mock('@services/transformed-media/transformed-media.service');

  const mockTransformedMediaService = {
    getVersions: jest.fn(),
  } as unknown as jest.Mocked<TransformedMediaService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowVersionsComponent],
      providers: [
        { provide: TransformedMediaService, useValue: mockTransformedMediaService },
        provideHttpClient(),
        provideRouter([]),
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowVersionsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    routerNavigateSpy = jest.spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display no data message when previousVersions is empty', () => {
    mockTransformedMediaService.getVersions.mockReturnValue(
      of({
        mediaObjectId: 'ABC123',
        currentVersion: {
          id: 1,
          courthouse: { id: 1, displayName: 'Court' },
          courtroom: { id: 1, name: 'Room' },
          startAt: DateTime.now(),
          endAt: DateTime.now(),
          channel: 1,
          chronicleId: 'abc',
          antecedentId: 'def',
          isCurrent: true,
          createdAt: DateTime.now(),
        },
        previousVersions: [],
      })
    );

    fixture = TestBed.createComponent(ShowVersionsComponent);
    fixture.detectChanges();

    const previousVersionsTable = fixture.nativeElement.querySelector('#previousVersionsTable');
    expect(previousVersionsTable.textContent).toContain('There are no previous versions of this audio.');
  });

  it('should display no data message when currentVersion is empty', () => {
    mockTransformedMediaService.getVersions.mockReturnValue(
      of({
        mediaObjectId: 'ABC123',
        currentVersion: null,
        previousVersions: [],
      })
    );

    fixture = TestBed.createComponent(ShowVersionsComponent);
    fixture.detectChanges();

    const previousVersionsTable = fixture.nativeElement.querySelector('#currentVersionTable');
    expect(previousVersionsTable.textContent).toContain('There is no current version of this audio.');
  });

  it('should store only the first selected version when multiple are selected', () => {
    const mockVersions = [{ id: 1 } as AudioVersion, { id: 2 } as AudioVersion];

    component.onSelectedVersion(mockVersions);

    expect(component.selectedVersion.length).toBe(1);
    expect(component.selectedVersion[0]).toEqual({ id: 1 });
  });

  it('should navigate to set-current with selected version ID', () => {
    fixture.componentRef.setInput('id', 999);
    component.selectedVersion = [
      {
        id: 123,
      } as AudioVersion,
    ];

    component.onDelete();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/admin/audio-file', 999, 'versions', 'set-current'], {
      state: { selectedAudioId: 123 },
    });
  });

  it('should not navigate if no version is selected', () => {
    component.selectedVersion = [];
    component.onDelete();

    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });
});
