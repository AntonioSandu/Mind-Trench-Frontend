import { TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

describe('ChangePasswordComponent', () => {

  let authServiceMock: any;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {

    authServiceMock = {
      getCurrentUserId: vi.fn()
    };

    userServiceMock = {
      changePassword: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
  imports: [ChangePasswordComponent],
  providers: [
    provideRouter([]),
    provideLocationMocks(),

    { provide: AuthService, useValue: authServiceMock },
    { provide: UserService, useValue: userServiceMock },
  ]
}).compileComponents();

  });

  function create() {
    const fixture = TestBed.createComponent(ChangePasswordComponent);
    return fixture.componentInstance;
  }

  it('should create', () => {
    const component = create();
    expect(component).toBeTruthy();
  });

  it('should NOT call service if form invalid', () => {
    const component = create();

    component.changePassword();

    expect(userServiceMock.changePassword).not.toHaveBeenCalled();
  });

  it('should NOT call service if userId is null', () => {
    const component = create();

    authServiceMock.getCurrentUserId.mockReturnValue(null);

    component.form.setValue({
      currentPassword: 'password123',
      newPassword: 'password123',
      confirmNewPassword: 'password123'
    });

    component.changePassword();

    expect(userServiceMock.changePassword).not.toHaveBeenCalled();
  });

  it('should call service and navigate', () => {

  const component = create();

  authServiceMock.getCurrentUserId.mockReturnValue(1);

  userServiceMock.changePassword.mockReturnValue(of(void 0));

  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate');

  component.form.setValue({
    currentPassword: 'password123',
    newPassword: 'password123',
    confirmNewPassword: 'password123'
  });

  component.form.updateValueAndValidity();

  component.changePassword();

  expect(userServiceMock.changePassword).toHaveBeenCalledTimes(1);
  expect(navigateSpy).toHaveBeenCalledTimes(1);
  expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
});

  it('should set errorMessage on error', () => {
    const component = create();

    authServiceMock.getCurrentUserId.mockReturnValue(1);

    userServiceMock.changePassword.mockReturnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 400,
          error: { message: 'error' }
        })
      )
    );

    component.form.setValue({
      currentPassword: 'password123',
      newPassword: 'password123',
      confirmNewPassword: 'password123'
    });

    component.changePassword();

    expect(component.errorMessage()).toBeTruthy();
  });

});