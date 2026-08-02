import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from '../../../../core/services/auth.service';
import { GameService } from '../../../../core/services/game.service';

import { GameMode } from '../../models/game-mode';
import { NewGameComponent } from './new-game';

describe('NewGameComponent', () => {

  let component: NewGameComponent;
  let fixture: ComponentFixture<NewGameComponent>;

  const authServiceMock = {
    getCurrentUserId: vi.fn()
  };

  const gameServiceMock = {
    createGame: vi.fn()
  };

  const routerMock = {
    navigate: vi.fn()
  };

  beforeEach(async () => {

    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [NewGameComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: GameService,
          useValue: gameServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(
        NewGameComponent
      );

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  it('should select game mode', () => {

    component.selectMode(
      GameMode.ENDLESS
    );

    expect(
      component.selectedMode()
    ).toBe(
      GameMode.ENDLESS
    );
  });

  it('should create a game and navigate on success', () => {

    authServiceMock
      .getCurrentUserId
      .mockReturnValue(1);

    gameServiceMock
      .createGame
      .mockReturnValue(
        of({
          id: 42,
          mode: GameMode.NORMAL,
          turnNumber: 1,
          createdAt: '2025-01-01'
        })
      );

    component.createGame();

    expect(
      gameServiceMock.createGame
    ).toHaveBeenCalledWith({
      userId: 1,
      mode: GameMode.NORMAL
    });

    expect(
      routerMock.navigate
    ).toHaveBeenCalledWith([
      '/game',
      42
    ]);

    expect(
      component.isLoading()
    ).toBe(false);

    expect(
      component.errorMessage()
    ).toBeNull();
  });

  it('should set error message when creation fails', () => {

    authServiceMock
      .getCurrentUserId
      .mockReturnValue(1);

    const error =
      new HttpErrorResponse({
        error: {
          message:
            'Maximum number of games reached.'
        },
        status: 400
      });

    gameServiceMock
      .createGame
      .mockReturnValue(
        throwError(() => error)
      );

    component.createGame();

    expect(
      component.errorMessage()
    ).toBe(
      'Maximum number of games reached.'
    );

    expect(
      component.isLoading()
    ).toBe(false);
  });

  it('should emit close event on cancel', () => {

    const emitSpy =
      vi.spyOn(
        component.close,
        'emit'
      );

    component.cancel();

    expect(emitSpy)
      .toHaveBeenCalledOnce();
  });

  it('should do nothing when current user id is null', () => {

    authServiceMock
      .getCurrentUserId
      .mockReturnValue(null);

    component.createGame();

    expect(
      gameServiceMock.createGame
    ).not.toHaveBeenCalled();

    expect(
      routerMock.navigate
    ).not.toHaveBeenCalled();
  });

});