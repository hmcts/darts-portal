import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, USER_PROFILE_PATH } from './user.service';
import { UserState } from '@darts-types/user-state';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUserState: UserState = { userName: 'test@test.com', userId: 1, roles: [] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads user profile', async () => {
    const userProfile = await userService.getUserProfile();
    expect(userProfile).toEqual(testData);
  });

  it('should cache user profile data after loading', () => {
    service.getUserProfile().subscribe();

    httpMock.expectOne(USER_PROFILE_PATH).flush(mockUserState);

    service.getUserProfile().subscribe();

    httpMock.expectNone(USER_PROFILE_PATH);
  });
});
