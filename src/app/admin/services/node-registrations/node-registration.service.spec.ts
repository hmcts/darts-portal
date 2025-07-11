import { NodeRegistrationData } from '@admin-types/node-registration/node-registration-data.interface';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { NodeRegistrationService } from './node-registration.service';

describe('NodeRegistrationService', () => {
  let service: NodeRegistrationService;
  let httpMock: HttpTestingController;
  let userServiceMock: jest.Mocked<UserAdminService>;

  const mockRegistrations: NodeRegistrationData[] = [
    {
      id: 1,
      courthouse: {
        display_name: 'Central Court',
        id: 0,
      },
      courtroom: {
        name: 'Room A',
        id: '',
      },
      ip_address: '192.168.1.10',
      hostname: 'host-001',
      mac_address: '00:1B:44:11:3A:B7',
      node_type: 'Recorder',
      created_at: '2024-01-01T12:00:00.000Z',
      created_by: 123,
    },
  ];

  const mockUsers = [{ id: 123, fullName: 'Alice Smith' }];

  beforeEach(() => {
    userServiceMock = {
      getUsersById: jest.fn().mockReturnValue(of(mockUsers)),
    } as unknown as jest.Mocked<UserAdminService>;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserAdminService, useValue: userServiceMock },
        NodeRegistrationService,
      ],
    });

    service = TestBed.inject(NodeRegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and map node registrations with user names', (done) => {
    service.getNodeRegistrations().subscribe((result) => {
      expect(result).toEqual([
        {
          id: 1,
          courthouse: 'Central Court',
          courtroom: 'Room A',
          ipAddress: '192.168.1.10',
          hostname: 'host-001',
          macAddress: '00:1B:44:11:3A:B7',
          nodeType: 'Recorder',
          createdAt: DateTime.fromISO('2024-01-01T12:00:00.000Z'),
          createdBy: 123,
          createdByName: 'Alice Smith',
        },
      ]);
      done();
    });

    const req = httpMock.expectOne('api/admin/node-register-management');
    expect(req.request.method).toBe('GET');
    req.flush(mockRegistrations);
  });
});
