import { NodeRegistrationData } from '@admin-types/node-registration/node-registration-data.interface';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeRegistrationService } from '@services/node-registrations/node-registration.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { NodeRegistrationsComponent } from './node-registrations.component';

describe('NodeRegistrationsComponent', () => {
  let component: NodeRegistrationsComponent;
  let fixture: ComponentFixture<NodeRegistrationsComponent>;
  let mockService: jest.Mocked<NodeRegistrationService>;

  const mockNodeRegistrations: NodeRegistrationData[] = [
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
      ip_address: '192.168.0.1',
      hostname: 'host-1',
      mac_address: 'AA:BB:CC:DD:EE:FF',
      node_type: 'Recorder',
      created_at: '2024-01-01T00:00:00.000Z',
      created_by: 10,
    },
    {
      id: 2,
      courthouse: {
        display_name: 'North Court',
        id: 0,
      },
      courtroom: {
        name: 'Room B',
        id: '',
      },
      ip_address: '192.168.0.2',
      hostname: 'host-2',
      mac_address: '11:22:33:44:55:66',
      node_type: 'Player',
      created_at: '2024-01-02T00:00:00.000Z',
      created_by: 11,
    },
  ];

  beforeEach(async () => {
    mockService = {
      getNodeRegistrations: jest.fn().mockReturnValue(
        of(
          mockNodeRegistrations.map((r) => ({
            id: r.id,
            courthouse: r.courthouse.display_name,
            courtroom: r.courtroom.name,
            ipAddress: r.ip_address,
            hostname: r.hostname ?? '',
            macAddress: r.mac_address,
            nodeType: r.node_type,
            createdAt: DateTime.fromISO(r.created_at),
            createdBy: r.created_by,
            createdByName: r.created_by === 10 ? 'Alice' : 'Bob',
          }))
        )
      ),
    } as unknown as jest.Mocked<NodeRegistrationService>;

    await TestBed.configureTestingModule({
      imports: [NodeRegistrationsComponent],
      providers: [provideHttpClient(), DatePipe, { provide: NodeRegistrationService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially show loading as false after data loads', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should load and expose full node registrations', () => {
    const result = component.nodeRegistrations();
    expect(result.length).toBe(2);
    expect(result[0].courthouse).toBe('Central Court');
    expect(result[1].courthouse).toBe('North Court');
  });

  it('should return all items when courthouse filter is empty', () => {
    component.courthouseValue.set('');
    const filtered = component.filteredNodeRegistrations();
    expect(filtered.length).toBe(2);
  });

  it('should filter node registrations by courthouse name (case-insensitive)', () => {
    component.onFormChange('central');
    const filtered = component.filteredNodeRegistrations();
    expect(filtered.length).toBe(1);
    expect(filtered[0].courthouse).toBe('Central Court');
  });

  it('should return no matches if courthouse filter does not match anything', () => {
    component.onFormChange('does-not-exist');
    const filtered = component.filteredNodeRegistrations();
    expect(filtered.length).toBe(0);
  });
});
