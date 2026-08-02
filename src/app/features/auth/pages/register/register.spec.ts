import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RegisterComponent } from './register';
import { AuthService } from '../../../../core/services/auth.service';
import { provideRouter, Router } from '@angular/router';

import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';

describe('RegisterComponent', () => {

  let authService: {
    register: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {

  authService = {
    register: vi.fn()
  };

  await TestBed.configureTestingModule({
    imports: [
      RegisterComponent
    ],

    providers: [
      { provide: AuthService, useValue: authService },

      provideRouter([])
    ]

  }).compileComponents();

});

  function create() {
    const fixture = TestBed.createComponent(RegisterComponent);

    return fixture.componentInstance;
  }

  it('should create', () => {

    const component = create();

    expect(component).toBeTruthy();

  });

  it('should NOT call register if form invalid', () => {

    const component = create();

    component.register();

    expect(authService.register).not.toHaveBeenCalled();

  });

  it('should call register and navigate', () => {

  const component = create();

  const router = TestBed.inject(Router);

  const navigateSpy =
    vi.spyOn(router, 'navigate');

  authService.register.mockReturnValue(
    of({
      id: 1,
      username: 'testuser'
    })
  );

  component.form.setValue({
    username: 'testuser',
    password: 'password123',
    confirmPassword: 'password123'
  });

  component.register();

  expect(authService.register)
    .toHaveBeenCalled();

  expect(navigateSpy)
    .toHaveBeenCalledWith([
      '/dashboard'
    ]);

});

  it('should set errorMessage on error', () => {

  const component = create();

  authService.register.mockReturnValue(
    throwError(() =>
      new HttpErrorResponse({
        status: 400,
        error: {
          message: 'Registration failed'
        }
      })
    )
  );

  component.form.setValue({
    username: 'testuser',
    password: 'password123',
    confirmPassword: 'password123'
  });

  component.register();

  expect(component.errorMessage()).toBe(
    'Registration failed'
  );

});

});