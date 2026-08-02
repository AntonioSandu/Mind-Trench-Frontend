import { TestBed } from '@angular/core/testing';
import { DeleteAccountComponent } from './delete-account';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';

describe('DeleteAccountComponent', () => {

  let userServiceMock: any;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {

    userServiceMock = {
      deleteUser: vi.fn()
    };

    authServiceMock = {
      getCurrentUserId: vi.fn(),
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [DeleteAccountComponent],
      providers: [
        provideRouter([]),

        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  function create() {
    const fixture = TestBed.createComponent(DeleteAccountComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should create', () => {
    expect(create()).toBeTruthy();
  });

  it('should NOT call service if form invalid', () => {
    const component = create();

    component.deleteAccount();

    expect(userServiceMock.deleteUser).not.toHaveBeenCalled();
  });

  it('should NOT call service if userId is null', () => {
    const component = create();

    authServiceMock.getCurrentUserId.mockReturnValue(null);

    component.form.setValue({ password: 'password123' });

    component.deleteAccount();

    expect(userServiceMock.deleteUser).not.toHaveBeenCalled();
  });

  it('should delete account, logout and navigate', () => {
    const component = create();

    authServiceMock.getCurrentUserId.mockReturnValue(1);

    userServiceMock.deleteUser.mockReturnValue(of(void 0));

    const navigateSpy = vi.spyOn(router, 'navigate');

    component.form.setValue({ password: 'password123' });

    component.deleteAccount();

    expect(userServiceMock.deleteUser).toHaveBeenCalled();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should set errorMessage on error', () => {
    const component = create();

    authServiceMock.getCurrentUserId.mockReturnValue(1);

    userServiceMock.deleteUser.mockReturnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 400,
          error: { message: 'Delete failed' }
        })
      )
    );

    component.form.setValue({ password: 'password123' });

    component.deleteAccount();

    expect(component.errorMessage()).toBeTruthy();
  });

});