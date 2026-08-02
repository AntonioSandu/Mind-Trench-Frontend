import { Component, EventEmitter, Output, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { GameService } from '../../../../core/services/game.service';
import { GameMode } from '../../models/game-mode';
import { HttpErrorResponse } from '@angular/common/http';
import { getErrorMessage } from '../../../../core/utils/error.utils';
import { A11yModule } from '@angular/cdk/a11y';


@Component({
  selector: 'app-new-game',
  imports: [CommonModule, A11yModule],
  templateUrl: './new-game.html',
  styleUrl: './new-game.css'
})
export class NewGameComponent {

  private readonly authService =
    inject(AuthService);

  private readonly gameService =
    inject(GameService);

  private readonly router =
    inject(Router);

  @Output()
  readonly close =
    new EventEmitter<void>();

  readonly errorMessage =
    signal<string | null>(null);

  readonly isLoading =
    signal(false);

  readonly selectedMode =
    signal<GameMode>(
      GameMode.NORMAL
    );

  protected readonly GameMode =
    GameMode;

  selectMode(
    mode: GameMode
  ): void {

    this.selectedMode.set(mode);

  }

  createGame(): void {

    const userId =
      this.authService.getCurrentUserId();

    if (userId === null) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.gameService
      .createGame({

        userId,

        mode:
          this.selectedMode()

      })
      .pipe(
        finalize(() =>
          this.isLoading.set(false)
        )
      )
      .subscribe({

        next: (game) => {

          this.router.navigate([
            '/game',
            game.id
          ]);

        },

        error: (
          err: HttpErrorResponse
        ) => {
          this.errorMessage.set(
            getErrorMessage(
              err,
              'Unable to create game.'
            )
          );
        }

      });

  }

  cancel(): void {

    this.close.emit();

  }

}