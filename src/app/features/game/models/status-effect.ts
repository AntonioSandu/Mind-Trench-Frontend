import { StatusEffectType } from "./status-effect-type";

export interface StatusEffect {

    type: StatusEffectType;

    remainingTurns: number;

}