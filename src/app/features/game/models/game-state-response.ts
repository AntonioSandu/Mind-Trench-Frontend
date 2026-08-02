import { GameMode } from './game-mode';
import { NodeId } from './node-id';
import { ItemType } from './item-type';
import { StatusEffect } from './status-effect';
import { MapEffect } from './map-effect';
import { LogEntry } from './log-entry';
import { GameResult } from './game-result';

export interface GameStateResponse {
    playerHealth: number;
    bossHealth: number;
    playerNode: NodeId;
    playerInventory: ItemType[];
    playerStatusEffects: StatusEffect[];
    playerVisibleMapEffects: MapEffect[];
    logs: LogEntry[];
    turnNumber: number;
    mode: GameMode;
    endlessScore: number;
    result: GameResult;
    gameOver: boolean;
}