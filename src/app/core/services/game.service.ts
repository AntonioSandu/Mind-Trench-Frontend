import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { CreateGameRequest } from '../../features/game/models/create-game-request';
import { GameResponse } from '../../features/game/models/game-response';
import { GameStateResponse } from '../../features/game/models/game-state-response';
import { ItemRequest } from '../../features/game/models/item-request';
import { TurnRequest } from '../../features/game/models/turn-request';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/game`;

  createGame(
    request: CreateGameRequest
  ): Observable<GameResponse> {

    return this.http.post<GameResponse>(
      this.apiUrl,
      request
    );

  }

  getGamesByUser(
    userId: number
  ): Observable<GameResponse[]> {

    return this.http.get<GameResponse[]>(
      `${this.apiUrl}/user/${userId}`
    );

  }

  getGameById(
    userId: number,
    gameId: number
  ): Observable<GameStateResponse> { 

    return this.http.get<GameStateResponse>(
      `${this.apiUrl}/${gameId}`,
      {
        params: {
          userId
        }
      }
    );

  }

  deleteGame(
    userId: number,
    gameId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${gameId}`,
      {
        params: {
          userId
        }
      }
    );

  }

  playTurn(
    userId: number,
    gameId: number,
    request: TurnRequest
  ): Observable<GameStateResponse> {
    return this.http.patch<GameStateResponse>(
      `${this.apiUrl}/${gameId}/turn`,
      request,
      {
        params: {
          userId
        }
      }
    );
  }

  useItem(
    userId: number,
    gameId: number,
    request: ItemRequest
  ): Observable<GameStateResponse> {
    return this.http.patch<GameStateResponse>(
      `${this.apiUrl}/${gameId}/item`,
      request,
      {
        params: {
          userId
        }
      }
    );
  }

  forgetItem(
    userId: number,
    gameId: number,
    request: ItemRequest
  ): Observable<GameStateResponse> {
    return this.http.patch<GameStateResponse>(
      `${this.apiUrl}/${gameId}/forget`,
      request,
      {
        params: {
          userId
        }
      }
    );
  }



}