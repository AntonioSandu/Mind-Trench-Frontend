import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideLocationMocks } from '@angular/common/testing';

import { DashboardComponent } from './dashboard';

import { AuthService } from '../../../../core/services/auth.service';
import { GameService } from '../../../../core/services/game.service';

import { GameMode } from '../../../game/models/game-mode';
import { GameResponse } from '../../../game/models/game-response';

const authServiceMock = {
  getCurrentUserId: vi.fn(),
  logout: vi.fn(),
  currentUser: vi.fn(() => ({ username: 'Test User' }))
};

const gameServiceMock = {
  getGamesByUser: vi.fn()
};

describe('DashboardComponent', () => {

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const games: GameResponse[] = [
    {
      id: 1,
      mode: GameMode.NORMAL,
      turnNumber: 1,
      createdAt: '2025-01-01'
    }
  ];

  beforeEach(async () => {

    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: GameService, useValue: gameServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close new game modal', () => {

    component.openNewGame();
    expect(component.showNewGameModal()).toBe(true);

    component.closeNewGame();
    expect(component.showNewGameModal()).toBe(false);
  });

  it('should load games and open continue modal', () => {

    authServiceMock.getCurrentUserId.mockReturnValue(1);
    gameServiceMock.getGamesByUser.mockReturnValue(of(games));

    component.openContinueGame();

    expect(gameServiceMock.getGamesByUser)
      .toHaveBeenCalledWith(1);

    expect(component.games().length)
      .toBe(1);

    expect(component.showContinueGameModal())
      .toBe(true);
  });

  it('should show error when no games exist', () => {

    authServiceMock.getCurrentUserId.mockReturnValue(1);
    gameServiceMock.getGamesByUser.mockReturnValue(of([]));

    component.openContinueGame();

    expect(component.continueGameErrorMessage())
      .toBe('No games found. Start a new game!');

    expect(component.showContinueGameModal())
      .toBe(false);
  });

  it('should set error when loading games fails', () => {

    authServiceMock.getCurrentUserId.mockReturnValue(1);

    gameServiceMock.getGamesByUser.mockReturnValue(
      throwError(() => new HttpErrorResponse({
        error: { message: 'fail' },
        status: 500
      }))
    );

    component.openContinueGame();

    expect(component.continueGameErrorMessage())
      .not.toBeNull();
  });

  it('should remove game on delete event', () => {

    component.games.set(games);

    component.onGameDeleted(1);

    expect(component.games().length)
      .toBe(0);
  });

  it('should close modal when last game is deleted', () => {

    component.games.set(games);

    component.showContinueGameModal.set(true);

    component.onGameDeleted(1);

    expect(component.showContinueGameModal())
      .toBe(false);

    expect(component.continueGameErrorMessage())
      .toBe('No games found. Start a new game!');
  });

  it('should logout and navigate home', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.logout();

    expect(authServiceMock.logout)
      .toHaveBeenCalled();

    expect(navigateSpy)
      .toHaveBeenCalledWith(['/']);
  });

})
