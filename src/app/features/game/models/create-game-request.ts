import { GameMode } from './game-mode';

export interface CreateGameRequest {
  userId: number;
  mode: GameMode;
}