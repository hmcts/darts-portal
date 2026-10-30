/** @jest-environment node */
import config from 'config';
import { Request, Response } from 'express';
import { getLaunchDarklyUserContext, init } from './user';

jest.mock('config', () => ({ get: jest.fn() }));
jest.mock('../app-insights', () => ({ trackException: jest.fn() }));

describe('getLaunchDarklyUserContext', () => {
  let request: Request;
  let response: Response;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.mocked(config.get).mockReset().mockReturnValue('test-signing-key');
    request = {
      session: { securityToken: { userState: { userId: 1, isActive: true } } },
    } as unknown as Request;
    response = {
      set: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return the user's ID as the key in the context and a hash of it signed with the SDK key", () => {
    getLaunchDarklyUserContext(request, response);

    expect(response.json).toHaveBeenCalledWith({
      context: { kind: 'user', key: '1' },
      // HMAC-SHA256 hash generated for user ID 1 using the test SDK key 'test-signing-key'.
      hash: '4ca05d31aa12320fd92d84c241cdfd03f2892e6a6ad67ac125920b90e34bdabd',
    });
  });

  it("should use the session user's ID when a different user ID is supplied in the query", () => {
    request.query = { userId: '2' };

    getLaunchDarklyUserContext(request, response);

    expect(response.json).toHaveBeenCalledWith({
      context: { kind: 'user', key: '1' },
      // HMAC-SHA256 hash generated for user ID 1 using the test SDK key 'test-signing-key'.
      hash: '4ca05d31aa12320fd92d84c241cdfd03f2892e6a6ad67ac125920b90e34bdabd',
    });
  });

  it('should prevent browsers and proxies from storing the signed user context by setting Cache-Control to no-store', () => {
    getLaunchDarklyUserContext(request, response);

    expect(response.set).toHaveBeenCalledWith('Cache-Control', 'no-store');
  });

  it.each([undefined, {}, { securityToken: undefined }, { securityToken: {} }])(
    "should return 401 when the user's state is missing from the session - %o",
    (session) => {
      request = { session } as unknown as Request;

      getLaunchDarklyUserContext(request, response);

      expect(response.sendStatus).toHaveBeenCalledWith(401);
      expect(response.json).not.toHaveBeenCalled();
    }
  );

  it.each([undefined, 0, -1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1])(
    "should return 401 when the user's ID is not a safe whole number greater than 0 - %p",
    (userId) => {
      request = { session: { securityToken: { userState: { userId, isActive: true } } } } as unknown as Request;

      getLaunchDarklyUserContext(request, response);

      expect(response.sendStatus).toHaveBeenCalledWith(401);
      expect(response.json).not.toHaveBeenCalled();
    }
  );

  it('should return 403 when the user is inactive', () => {
    request = { session: { securityToken: { userState: { userId: 1, isActive: false } } } } as unknown as Request;

    getLaunchDarklyUserContext(request, response);

    expect(response.sendStatus).toHaveBeenCalledWith(403);
    expect(response.json).not.toHaveBeenCalled();
  });

  it.each(['', '   ', undefined])('should return 500 when the SDK key is empty - %p', (sdkKey) => {
    jest.mocked(config.get).mockReturnValue(sdkKey);

    getLaunchDarklyUserContext(request, response);

    expect(response.sendStatus).toHaveBeenCalledWith(500);
    expect(response.json).not.toHaveBeenCalled();
  });
});

describe('init', () => {
  it('should register the LaunchDarkly context route', () => {
    const route = init().stack.find((layer) => layer.route?.path === '/launchdarkly-context')?.route;

    expect(route?.stack[0].handle).toBe(getLaunchDarklyUserContext);
  });
});
