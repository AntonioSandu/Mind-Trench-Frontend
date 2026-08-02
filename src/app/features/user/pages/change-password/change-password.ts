import { Component, inject, signal } from '@angular/core';
import { matchValidator } from '../../../../shared/validators/match.validator';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ChangePasswordRequest } from '../../models/changepassword-request';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs';
import { getErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePasswordComponent {
    private readonly authService =
      inject(AuthService);

    private readonly userService =
      inject(UserService);
    private readonly router = inject(Router);

    readonly errorMessage = signal<string | null>(null);

    readonly isLoading = signal(false);
    
    readonly form = new FormGroup({

    currentPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    }),

    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    }),

    confirmNewPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    })

  },
  {
    validators: matchValidator('newPassword', 'confirmNewPassword')
  });

  changePassword(): void {

    this.errorMessage.set(null);

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.isLoading.set(true);

    const userId = this.authService.getCurrentUserId();

    if (userId === null) {

      this.isLoading.set(false);

      return;

    }

    const rawValue = this.form.getRawValue();

    const request: ChangePasswordRequest = {

      currentPassword: rawValue.currentPassword,

      newPassword: rawValue.newPassword,

      confirmNewPassword: rawValue.confirmNewPassword

    };

    this.userService
      .changePassword(userId, request)
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
              'Error during password change.'
            )
          );

        }

      });

  }
}