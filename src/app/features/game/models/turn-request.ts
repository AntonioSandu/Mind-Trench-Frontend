import { ActionType } from './action-type';
import { NodeId } from './node-id';

export interface TurnRequest {
    actionType: ActionType;
    targetNodes: NodeId[];
}