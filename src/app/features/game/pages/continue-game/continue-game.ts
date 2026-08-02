import { Component, EventEmitter, Output, computed, inject, input, signal} from '@angular/core';
import { Router } from '@angular/router';
import { GameResponse } from '../../models/game-response';
import { GameMode } from '../../models/game-mode';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { GameService } from '../../../../core/services/game.service';
import { getErrorMessage } from '../../../../core/utils/error.utils';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-continue-game',
  imports: [A11yModule],
  templateUrl: './continue-game.html',
  styleUrl: './continue-game.css'
})
export class ContinueGameComponent {
  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  private readonly gameService = inject(GameService);

  readonly games = input.required<GameResponse[]>();

  readonly initialMode = input.required<GameMode>();

  @Output()
  readonly close = new EventEmitter<void>();

  @Output()
  readonly gameDeleted = new EventEmitter<number>();

  readonly selectedMode = signal<GameMode | null>(null);

  readonly currentMode = computed(() => 
    this.selectedMode() ?? this.initialMode()
  );

  protected readonly GameMode = GameMode;

  readonly errorMessage = signal<string | null>(null);

  readonly isDeleting = signal(false);

  readonly hasNormalGames = computed(() =>
    this.games().some(game => game.mode === GameMode.NORMAL)
  );

  readonly hasEndlessGames = computed(() =>
    this.games().some(game => game.mode === GameMode.ENDLESS)
  );

  readonly gamesBySelectedMode = computed(() =>
    this.games()
      // 3. Sostituito this.selectedMode() con this.currentMode()
      .filter(game => game.mode === this.currentMode())
      .sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  );

  readonly displayedGames = computed(() => {
    const games = this.gamesBySelectedMode();

    return Array.from(
      { length: 3 },
      (_, index) => games[index] ?? null
    );
  });

  selectMode(mode: GameMode): void {
    this.selectedMode.set(mode);
  }

  continueGame(gameId: number): void {
    this.router.navigate(['/game', gameId]);
  }

  cancel(): void {
    this.close.emit();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  deleteGame( gameId: number ): void {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this game?'
      );

    if (!confirmed) {
      return;
    }

    const userId =
      this.authService.getCurrentUserId();

    if (userId === null) {
      return;
    }

    this.errorMessage.set(null);
    this.isDeleting.set(true);

    this.gameService
      .deleteGame(
        userId,
        gameId
      )
      .pipe(
        finalize(() =>
          this.isDeleting.set(false)
        )
      )
      .subscribe({
        next: () => {
          this.gameDeleted.emit(
            gameId
          );
        },

        error: (
          err: HttpErrorResponse
        ) => {
          this.errorMessage.set(
            getErrorMessage(
              err,
              'Unable to delete game.'
            )
          );
        }
      });
  }
}