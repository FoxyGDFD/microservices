import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';
import { JwtGuard } from './jwt.guard';

describe('JwtGuard', () => {
  let jwtGuard: JwtGuard;
  let authService: AuthService;

  beforeEach(() => {
    authService = {
      validateAccessToken: jest.fn(),
    } as any; // Mocking AuthService
    jwtGuard = new JwtGuard(authService);
  });

  const mockExecutionContext = (token?: string) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: token ? { authorization: `Bearer ${token}` } : {},
        }),
      }),
    } as ExecutionContext;
  };

  it('should return true if token is valid', async () => {
    const mockTokenPayload = { isValid: true, userId: '123', role: 'admin' };
    (authService.validateAccessToken as jest.Mock).mockReturnValue(
      of(mockTokenPayload),
    );

    // Create a mock request object
    const mockRequest = {
      headers: { authorization: 'Bearer valid-token' },
    };

    // Mock ExecutionContext to return this request
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    // Call the guard
    const canActivate = await jwtGuard.canActivate(context);

    // Expectations
    expect(canActivate).toBe(true);
    expect(authService.validateAccessToken).toHaveBeenCalledWith({
      token: 'valid-token',
    });
    expect(mockRequest['user']).toBe('123'); // Now explicitly checking the mock request object
    expect(mockRequest['role']).toBe('admin');
  });

  it('should throw UnauthorizedException if token is missing', async () => {
    const context = mockExecutionContext();

    await expect(jwtGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(authService.validateAccessToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    (authService.validateAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const context = mockExecutionContext('invalid-token');
    await expect(jwtGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(authService.validateAccessToken).toHaveBeenCalledWith({
      token: 'invalid-token',
    });
  });
});
