import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LoginComponent } from './login';
import { AuthService } from '../../../../core/services/auth.service';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';

describe('LoginComponent', () => {

  let authService: {
    login: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {

    authService = {
      login: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent
      ],

      providers: [
        { provide: AuthService, useValue: authService },
        provideRouter([])
      ]
    }).compileComponents();

  });

  function create() {
    const fixture = TestBed.createComponent(LoginComponent);
    return fixture.componentInstance;
  }

  it('should create', () => {
    const component = create();
    expect(component).toBeTruthy();
  });

  it('should NOT call login if form invalid', () => {
    const component = create();
    component.login();
    expect(authService.login).not.toHaveBeenCalled();
  });

 it('should call login and navigate to dashboard', () => {

  const component = create();

  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate');

  authService.login.mockReturnValue(
    of({ id: 1, username: 'testuser' })
  );

  component.form.setValue({
    username: 'testuser',
    password: 'password123'
  });

  component.login();

  expect(authService.login).toHaveBeenCalled();

  expect(navigateSpy.mock.calls[0][0]).toEqual(['/dashboard']);

});

  it('should set errorMessage on login error', () => {

    const component = create();

    authService.login.mockReturnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 401,
          error: { message: 'Invalid credentials' }
        })
      )
    );

    component.form.setValue({
      username: 'testuser',
      password: 'password123'
    });

    component.login();

    expect(component.errorMessage()).toBe('Invalid credentials');

  });

});