import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  TestBed
} from '@angular/core/testing';

import { describe, expect, it, beforeEach } from 'vitest';

import { environment } from '../../../environments/environment';

import { GameService } from './game.service';

import { GameMode } from '../../features/game/models/game-mode';
import { GameResponse } from '../../features/game/models/game-response';

describe('GameService', () => {

  let service: GameService;
  let httpMock: HttpTestingController;

  const apiUrl =
    `${environment.apiUrl}/game`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service =
      TestBed.inject(GameService);

    httpMock =
      TestBed.inject(
        HttpTestingController
      );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a game', () => {
    const response: GameResponse = {
      id: 1,
      mode: GameMode.NORMAL,
      turnNumber: 1,
      createdAt: '2025-01-01T12:00:00'
    };

    service.createGame({
      userId: 42,
      mode: GameMode.NORMAL
    }).subscribe(game => {
      expect(game).toEqual(response);
    });

    const request =
      httpMock.expectOne(apiUrl);

    expect(request.request.method)
      .toBe('POST');

    expect(request.request.body)
      .toEqual({
        userId: 42,
        mode: GameMode.NORMAL
      });

    request.flush(response);
  });

  it('should get games by user', () => {
    const response: GameResponse[] = [
      {
        id: 1,
        mode: GameMode.NORMAL,
        turnNumber: 5,
        createdAt: '2025-01-01T12:00:00'
      }
    ];

    service
      .getGamesByUser(42)
      .subscribe(games => {
        expect(games)
          .toEqual(response);
      });

    const request =
      httpMock.expectOne(
        `${apiUrl}/user/42`
      );

    expect(request.request.method)
      .toBe('GET');

    request.flush(response);
  });

  it('should get a game by id', () => {
    const response: GameResponse = {
      id: 1,
      mode: GameMode.NORMAL,
      turnNumber: 3,
      createdAt: '2025-01-01T12:00:00'
    };

    service
      .getGameById(42, 1)
      .subscribe(game => {
        expect(game)
          .toEqual(response);
      });

    const request =
      httpMock.expectOne(
        req =>
          req.url ===
            `${apiUrl}/1`
          &&
          req.params.get(
            'userId'
          ) === '42'
      );

    expect(request.request.method)
      .toBe('GET');

    request.flush(response);
  });

  it('should delete a game', () => {
    service
      .deleteGame(42, 1)
      .subscribe();

    const request =
      httpMock.expectOne(
        req =>
          req.url ===
            `${apiUrl}/1`
          &&
          req.params.get(
            'userId'
          ) === '42'
      );

    expect(request.request.method)
      .toBe('DELETE');

    request.flush(null);
  });

});