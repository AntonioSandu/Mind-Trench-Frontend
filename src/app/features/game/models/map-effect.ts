import { MapEffectType } from "./map-effect-type";
import { NodeId } from "./node-id";

export interface MapEffect {
    type: MapEffectType;
    firstNode: NodeId;
    secondNode: NodeId | null;
    belongsToPlayer: boolean;
}