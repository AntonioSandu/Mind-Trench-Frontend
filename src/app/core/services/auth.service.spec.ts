import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../features/auth/models/login-request';
import { RegisterRequest } from '../../features/auth/models/register-request';
import { AuthResponse } from '../../features/auth/models/auth-response';

const mockUser: AuthResponse = {
  id: 1,
  username: 'testuser',
  bestEndlessScore: 2
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  // ---------------- LOGIN ----------------

  it('should login and store user in localStorage', () => {
  const request: LoginRequest = {
    username: 'test',
    password: 'password123'
  };

  service.login(request).subscribe(res => {
    expect(res).toEqual(mockUser);
  });

  const req = httpMock.expectOne(
    `${environment.apiUrl}/user/login`
  );

  expect(req.request.method).toBe('POST');
  req.flush(mockUser);

  const stored = localStorage.getItem('currentUser');
  expect(stored).toBeTruthy();
});

  // ---------------- REGISTER ----------------

  it('should register and store user in localStorage', () => {
  const request: RegisterRequest = {
    username: 'test',
    password: 'password123',
    confirmPassword: 'password123'
  };

  service.register(request).subscribe(res => {
    expect(res).toEqual(mockUser);
  });

  const req = httpMock.expectOne(
    `${environment.apiUrl}/user/register`
  );

  expect(req.request.method).toBe('POST');
  req.flush(mockUser);

  const stored = localStorage.getItem('currentUser');
  expect(stored).toBeTruthy();
});

  // ---------------- LOGOUT ----------------

  it('should logout and clear storage', () => {
  localStorage.setItem('currentUser', JSON.stringify(mockUser));

  service.logout();

  expect(localStorage.getItem('currentUser')).toBeNull();
  expect(service.currentUser()).toBeNull();
  expect(service.isLoggedIn()).toBeFalsy();
});

  // ---------------- GETTERS ----------------

  it('should return current user id', () => {
  service['currentUserSignal'].set(mockUser);

  const id = service.getCurrentUserId();

  expect(id).toBe(mockUser.id);
});

  it('should return username', () => {
  service['currentUserSignal'].set(mockUser);

  const username = service.getCurrentUsername();

  expect(username).toBe(mockUser.username);
});
});