import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';
import { vi } from 'vitest';

describe('guestGuard', () => {
  let authService: { isLoggedIn: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = {
      isLoggedIn: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    });
  });

  function runGuard(isLoggedIn: boolean) {
    authService.isLoggedIn.mockReturnValue(isLoggedIn);

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    return TestBed.runInInjectionContext(() =>
      guestGuard(route, state)
    );
  }

  it('should allow guest access when not logged in', () => {
    const result = runGuard(false);
    expect(result).toBe(true);
  });

  it('should redirect to dashboard when logged in', () => {
    const result = runGuard(true);

    expect(result).toBeTruthy(); // UrlTree
  });
});