import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { NewGameComponent } from '../../../game/pages/new-game/new-game';
import { finalize } from 'rxjs';
import { GameService } from '../../../../core/services/game.service';
import { getErrorMessage } from '../../../../core/utils/error.utils';
import { HttpErrorResponse } from '@angular/common/http';
import { GameResponse } from '../../../game/models/game-response';
import { GameMode } from '../../../game/models/game-mode';
import { ContinueGameComponent } from '../../../game/pages/continue-game/continue-game';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, NewGameComponent, ContinueGameComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

  private readonly gameService = inject(GameService);

  protected readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  readonly showContinueGameModal = signal(false);

  readonly games = signal<GameResponse[]>([]);

  readonly continueGameErrorMessage = signal<string | null>(null);

  readonly initialContinueMode = signal(GameMode.NORMAL);

  readonly isLoadingGames = signal(false);

  readonly showNewGameModal = signal(false);

  openNewGame(): void {
    this.showNewGameModal.set(true);
  }

  closeNewGame(): void {
    this.showNewGameModal.set(false);
  }

  openContinueGame(): void {
    this.continueGameErrorMessage.set(
      null
    );

    const userId =
      this.authService.getCurrentUserId();

    if (userId === null) {
      return;
    }

    this.isLoadingGames.set(true);

    this.gameService
      .getGamesByUser(userId)
      .pipe(
        finalize(() =>
          this.isLoadingGames.set(false)
        )
      )
      .subscribe({
        next: (games) => {
          if (games.length === 0) {
            this.continueGameErrorMessage.set(
              'No games found. Start a new game!'
            );

            return;
          }

          this.games.set(games);

          const hasNormalGames =
            games.some(
              game =>
                game.mode ===
                GameMode.NORMAL
            );

          const hasEndlessGames =
            games.some(
              game =>
                game.mode ===
                GameMode.ENDLESS
            );

          if (
            hasNormalGames &&
            hasEndlessGames
          ) {
            this.initialContinueMode.set(
              GameMode.NORMAL
            );
          } else if (
            hasNormalGames
          ) {
            this.initialContinueMode.set(
              GameMode.NORMAL
            );
          } else {
            this.initialContinueMode.set(
              GameMode.ENDLESS
            );
          }

          this.showContinueGameModal.set(
            true
          );
        },

        error: (
          err: HttpErrorResponse
        ) => {
          this.continueGameErrorMessage.set(
            getErrorMessage(
              err,
              'Unable to load games.'
            )
          );
        }
      });
  }

  closeContinueGame(): void {
    this.showContinueGameModal.set(
      false
    );
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/']);

  }

  onGameDeleted(gameId: number): void {

    this.games.update(
      games =>
        games.filter(
          game =>
            game.id !== gameId
        )
    );

    if (
      this.games().length === 0
    ) {

      this.closeContinueGame();

      this.continueGameErrorMessage.set(
        'No games found. Start a new game!'
      );
    }
  }

}