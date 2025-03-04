import { User } from '@admin-types/index';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs';
import { CaseComponent } from './case.component';

jest.mock('@services/admin-case/admin-case.service');
jest.mock('@services/user-admin/user-admin.service');

describe('CaseComponent', () => {
  let component: CaseComponent;
  let fixture: ComponentFixture<CaseComponent>;
  let mockCaseService: jest.Mocked<AdminCaseService>;
  let mockUserAdminService: jest.Mocked<UserAdminService>;

  const mockCaseFile = {
    id: 1,
    caseNumber: 'CASE1001',
    createdById: 101,
    lastModifiedById: 102,
    caseStatus: 'Open',
  };

  const mockUsers = [
    { id: 101, fullName: 'Alice Johnson' },
    { id: 102, fullName: 'Bob Smith' },
  ] as unknown as User[];

  beforeEach(async () => {
    mockCaseService = {
      getCase: jest.fn().mockReturnValue(of(mockCaseFile)),
    } as unknown as jest.Mocked<AdminCaseService>;

    mockUserAdminService = {
      getUsersById: jest.fn().mockReturnValue(of(mockUsers)),
    } as unknown as jest.Mocked<UserAdminService>;

    await TestBed.configureTestingModule({
      imports: [CaseComponent],
      providers: [
        { provide: AdminCaseService, useValue: mockCaseService },
        { provide: UserAdminService, useValue: mockUserAdminService },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('caseFile$ Observable', () => {
    it('should fetch case file and map user names correctly', (done) => {
      component.caseFile$.subscribe((caseFile) => {
        expect(caseFile).toEqual({
          ...mockCaseFile,
          createdBy: 'Alice Johnson',
          lastModifiedBy: 'Bob Smith',
        });
        done();
      });

      expect(mockCaseService.getCase).toHaveBeenCalledWith(component.caseId());
      expect(mockUserAdminService.getUsersById).toHaveBeenCalledWith([101, 102]);
    });

    it('should handle missing users and set fallback values', (done) => {
      mockUserAdminService.getUsersById.mockReturnValue(of([])); // No users returned

      component.caseFile$.subscribe((caseFile) => {
        expect(caseFile).toEqual({
          ...mockCaseFile,
          createdBy: undefined,
          lastModifiedBy: undefined,
        });
        done();
      });

      expect(mockCaseService.getCase).toHaveBeenCalledWith(component.caseId());
      expect(mockUserAdminService.getUsersById).toHaveBeenCalledWith([101, 102]);
    });
  });
});
