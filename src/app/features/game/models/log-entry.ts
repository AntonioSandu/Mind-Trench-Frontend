import { LogType } from "./log-type";

export interface LogEntry {
    turnNumber: number;
    type: LogType;
    playerSide: boolean;
    message: string;
}