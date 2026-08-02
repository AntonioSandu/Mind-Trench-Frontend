import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { LoginRequest } from '../../features/auth/models/login-request';
import { RegisterRequest } from '../../features/auth/models/register-request';
import { AuthResponse } from '../../features/auth/models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/user`;

  private static readonly STORAGE_KEY = 'currentUser';

  private readonly currentUserSignal =
    signal<AuthResponse | null>(
      this.loadUserFromStorage()
    );

  readonly currentUser = computed(
    () => this.currentUserSignal()
  );

  readonly isLoggedIn = computed(
    () => this.currentUserSignal() !== null
  );

  login(request: LoginRequest): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      request
    ).pipe(

      tap(response => this.saveCurrentUser(response))

    );

  }

  register(request: RegisterRequest): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      request
    ).pipe(

      tap(response => this.saveCurrentUser(response))

    );

  }

  logout(): void {

    localStorage.removeItem(
      AuthService.STORAGE_KEY
    );

    this.currentUserSignal.set(null);

  }

  getCurrentUserId(): number | null {

    return this.currentUser()?.id ?? null;

  }

  getCurrentUsername(): string | null {

    return this.currentUser()?.username ?? null;

  }

  getCurrentBestEndlessScore(): number | null {

    return this.currentUser()?.bestEndlessScore ?? null;
  }

  private saveCurrentUser(user: AuthResponse): void {

    localStorage.setItem(
      AuthService.STORAGE_KEY,
      JSON.stringify(user)
    );

    this.currentUserSignal.set(user);

  }

  private loadUserFromStorage(): AuthResponse | null {

    const user = localStorage.getItem(
      AuthService.STORAGE_KEY
    );

    if (!user) {
      return null;
    }

    return JSON.parse(user) as AuthResponse;

  }

}