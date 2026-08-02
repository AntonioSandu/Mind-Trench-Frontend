import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { getErrorMessage } from '../../../../core/utils/error.utils';
import { matchValidator } from '../../../../shared/validators/match.validator';

import { RegisterRequest } from '../../models/register-request';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorMessage = signal<string | null>(null);

  readonly isLoading = signal(false);

  readonly form = new FormGroup(
    {
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
      }),

      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8)
        ]
      })
    },
    {
      validators: [
        matchValidator(
          'password',
          'confirmPassword'
        )
      ]
    }
  );

  register(): void {

    this.errorMessage.set(null);

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.isLoading.set(true);

    const rawValue = this.form.getRawValue();

    const request: RegisterRequest = {
      username: rawValue.username,
      password: rawValue.password,
      confirmPassword: rawValue.confirmPassword
    };

    this.authService
      .register(request)
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

        error: (
          err: HttpErrorResponse
        ) => {

          this.errorMessage.set(
            getErrorMessage(
              err,
              'Error during sign up.'
            )
          );

        }

      });

  }

}