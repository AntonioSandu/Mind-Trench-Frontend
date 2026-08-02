import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { getErrorMessage } from '../../../../core/utils/error.utils';

import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = signal(false);

  readonly form = new FormGroup({

    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    })

  });

  login(): void {

    this.errorMessage.set(null);

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.isLoading.set(true);

    const request: LoginRequest =
      this.form.getRawValue();

    this.authService
      .login(request)
      .pipe(
        finalize(() =>
          this.isLoading.set(false)
        )
      )
      .subscribe({

        next: () => {

          this.router.navigate([
            '/dashboard'
          ]);

        },

        error: (err: HttpErrorResponse) => {

          this.errorMessage.set(
            getErrorMessage(
              err,
              'Error during login.'
            )
          );

        }

      });

  }

}