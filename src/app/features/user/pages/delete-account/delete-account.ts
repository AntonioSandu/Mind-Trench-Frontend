import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { getErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-delete-account',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './delete-account.html',
  styleUrl: './delete-account.css',
})
export class DeleteAccountComponent {

  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = signal(false);

  readonly form = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    })
  });

  deleteAccount(): void {

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

    const request = {
      password: this.form.getRawValue().password
    };

    this.userService
      .deleteUser(userId, request)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({

        next: () => {

          this.authService.logout();

          this.router.navigate(['/']);

        },

        error: (err: HttpErrorResponse) => {

          this.errorMessage.set(
            getErrorMessage(
              err,
              'Error during account deletion.'
            )
          );

        }

      });

  }

}