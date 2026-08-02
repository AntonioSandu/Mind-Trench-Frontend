import { HttpErrorResponse } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  provideRouter,
  Router
} from '@angular/router';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import {
  of,
  throwError
} from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { GameService } from '../../../../core/services/game.service';

import { GameMode } from '../../models/game-mode';
import { GameResponse } from '../../models/game-response';
import { ContinueGameComponent } from './continue-game';

describe('ContinueGameComponent', () => {

  let component: ContinueGameComponent;
  let fixture: ComponentFixture<ContinueGameComponent>;

  const authServiceMock = {
    getCurrentUserId: vi.fn()
  };

  const gameServiceMock = {
    deleteGame: vi.fn()
  };

  const routerMock = {
    navigate: vi.fn()
  };

  const games: GameResponse[] = [
    {
      id: 1,
      mode: GameMode.NORMAL,
      turnNumber: 5,
      createdAt: '2025-01-01'
    },
    {
      id: 2,
      mode: GameMode.NORMAL,
      turnNumber: 2,
      createdAt: '2025-01-02'
    },
    {
      id: 3,
      mode: GameMode.ENDLESS,
      turnNumber: 10,
      createdAt: '2025-01-03'
    }
  ];

  beforeEach(async () => {

    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [
        ContinueGameComponent
      ],
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
        ContinueGameComponent
      );

    component =
      fixture.componentInstance;

    fixture.componentRef.setInput(
      'games',
      games
    );

    fixture.componentRef.setInput(
      'initialMode',
      GameMode.NORMAL
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  it('should use initial mode by default', () => {

    expect(
      component.currentMode()
    ).toBe(
      GameMode.NORMAL
    );
  });

  it('should select another mode', () => {

    component.selectMode(
      GameMode.ENDLESS
    );

    expect(
      component.currentMode()
    ).toBe(
      GameMode.ENDLESS
    );
  });

  it('should display exactly three slots', () => {

    expect(
      component.displayedGames()
        .length
    ).toBe(3);
  });

  it('should navigate when continuing a game', () => {

    component.continueGame(42);

    expect(
      routerMock.navigate
    ).toHaveBeenCalledWith([
      '/game',
      42
    ]);
  });

  it('should emit close event', () => {

    const emitSpy =
      vi.spyOn(
        component.close,
        'emit'
      );

    component.cancel();

    expect(emitSpy)
      .toHaveBeenCalledOnce();
  });

  it('should emit gameDeleted on successful deletion', () => {

    vi.spyOn(window, 'confirm')
      .mockReturnValue(true);

    authServiceMock
      .getCurrentUserId
      .mockReturnValue(1);

    gameServiceMock
      .deleteGame
      .mockReturnValue(
        of(undefined)
      );

    const emitSpy =
      vi.spyOn(
        component.gameDeleted,
        'emit'
      );

    component.deleteGame(2);

    expect(
      gameServiceMock.deleteGame
    ).toHaveBeenCalledWith(
      1,
      2
    );

    expect(emitSpy)
      .toHaveBeenCalledWith(2);

    expect(
      component.isDeleting()
    ).toBe(false);
  });

  it('should set error message when deletion fails', () => {

    vi.spyOn(window, 'confirm')
      .mockReturnValue(true);

    authServiceMock
      .getCurrentUserId
      .mockReturnValue(1);

    const error =
      new HttpErrorResponse({
        error: {
          message:
            'Unable to delete game.'
        },
        status: 400
      });

    gameServiceMock
      .deleteGame
      .mockReturnValue(
        throwError(() => error)
      );

    component.deleteGame(1);

    expect(
      component.errorMessage()
    ).toBe(
      'Unable to delete game.'
    );

    expect(
      component.isDeleting()
    ).toBe(false);
  });

  it('should not delete when confirmation is cancelled', () => {

    vi.spyOn(window, 'confirm')
      .mockReturnValue(false);

    component.deleteGame(1);

    expect(
      gameServiceMock.deleteGame
    ).not.toHaveBeenCalled();
  });

  it('should do nothing when current user id is null', () => {

    vi.spyOn(window, 'confirm')
      .mockReturnValue(true);

    authServiceMock
      .getCurrentUserId
      .mockReturnValue(null);

    component.deleteGame(1);

    expect(
      gameServiceMock.deleteGame
    ).not.toHaveBeenCalled();
  });

});