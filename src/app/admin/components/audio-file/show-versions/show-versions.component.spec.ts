import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ShowVersionsComponent } from './show-versions.component';

describe('ShowVersionsComponent', () => {
  let component: ShowVersionsComponent;
  let fixture: ComponentFixture<ShowVersionsComponent>;

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
});
