import { NodeId } from './node-id';

export interface ItemRequest {
    inventoryIndex: number;
    firstNode: NodeId | null;
    secondNode: NodeId | null;
}