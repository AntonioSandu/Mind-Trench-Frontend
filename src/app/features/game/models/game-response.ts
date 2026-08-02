import { GameMode } from './game-mode';

export interface GameResponse {
  id: number;
  mode: GameMode;
  turnNumber: number;
  createdAt: string;
}