import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LeaderboardResponse } from '../../features/home/models/leaderboard-response';

@Injectable({
    providedIn: 'root'
})
export class LeaderboardService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/leaderboard`;

    getLeaderboard():
        Observable<LeaderboardResponse[]> {

        return this.http.get<LeaderboardResponse[]>(
            this.apiUrl
        );

    }

}