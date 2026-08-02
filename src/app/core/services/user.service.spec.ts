import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { ChangePasswordRequest } from '../../features/user/models/changepassword-request';
import { DeleteAccountRequest } from '../../features/user/models/deleteaccount-request';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ---------------- CHANGE PASSWORD ----------------

  it('should call changePassword with PATCH', () => {
    const userId = 1;

    const request: ChangePasswordRequest = {
      currentPassword: 'old12345',
      newPassword: 'new12345',
      confirmNewPassword: 'new12345'
    };

    service.changePassword(userId, request).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/user/${userId}/password`
    );

    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(request);

    req.flush(null);
  });

  // ---------------- DELETE USER ----------------

  it('should call deleteUser with DELETE and body', () => {
    const userId = 1;

    const request: DeleteAccountRequest = {
      password: 'password123'
    };

    service.deleteUser(userId, request).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/user/${userId}`
    );

    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(request);

    req.flush(null);
  });
});