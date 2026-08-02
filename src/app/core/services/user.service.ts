import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { ChangePasswordRequest } from "../../features/user/models/changepassword-request";
import { DeleteAccountRequest } from "../../features/user/models/deleteaccount-request";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/user`;

  changePassword(
    userId: number,
    request: ChangePasswordRequest
  ): Observable<void> {

    return this.http.patch<void>(
      `${this.apiUrl}/${userId}/password`,
      request
    );

  }

  deleteUser(
    userId: number,
    request: DeleteAccountRequest
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${userId}`,
      { body: request }
    );

  }

}