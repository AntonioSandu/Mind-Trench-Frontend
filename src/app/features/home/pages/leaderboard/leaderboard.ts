import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LeaderboardService } from '../../../../core/services/leaderboard.service';
import { LeaderboardResponse } from '../../models/leaderboard-response';
import { getErrorMessage } from '../../../../core/utils/error.utils';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css'
})
export class LeaderboardComponent {

  private readonly router = inject(Router);

  private readonly leaderboardService = inject(LeaderboardService);

  readonly leaderboard = signal<LeaderboardResponse[]>([]);

  readonly isLoading = signal(false);

  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  private loadLeaderboard(): void {

    this.isLoading.set(true);

    this.errorMessage.set(null);

    this.leaderboardService.getLeaderboard().pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: response => {
        this.leaderboard.set(
          response
        );
      },

      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(getErrorMessage(
              err,
              'Unable to load leaderboard.'
            )
          );
      }
    });
  } 

  close(): void {
    this.router.navigate(['/dashboard']);
  }

}