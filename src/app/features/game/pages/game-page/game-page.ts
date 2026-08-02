import { Component, computed, inject, signal  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { GameStateResponse } from '../../models/game-state-response';
import { AuthService } from '../../../../core/services/auth.service';
import { GameService } from '../../../../core/services/game.service';
import { finalize, Observable } from 'rxjs';
import { getErrorMessage } from '../../../../core/utils/error.utils';
import { HttpErrorResponse } from '@angular/common/http';
import { GameMode } from '../../models/game-mode';
import { MapComponent } from '../../pages/map/map';
import { InventoryComponent } from '../inventory/inventory';
import { NodeId } from '../../models/node-id';
import { ActionType } from '../../models/action-type';
import { ItemType } from '../../models/item-type';
import { LogType } from '../../models/log-type';
import { StatusEffectType } from '../../models/status-effect-type';
import { NodeSelectionComponent } from '../node-selection/node-selection';
import { GameResult } from '../../models/game-result';
import { GameOverComponent } from '../game-over/game-over';
import { ActionErrorComponent } from '../action-error/action-error';
import { GameErrorComponent } from '../game-error/game-error';
import { HostListener } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';

enum PendingSelectionType {
  MOVE,
  STRIKE,
  USE_ITEM
}

interface NodeSelectionConfig {
  firstNodes: NodeId[];
  secondNodes: (first: NodeId) => NodeId[];
  requiredNodes: 1 | 2;
}

@Component({
  selector: 'app-game-page',
  imports: [MapComponent, InventoryComponent, NodeSelectionComponent, GameOverComponent, ActionErrorComponent, GameErrorComponent],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css',
})
export class GamePageComponent {

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  private readonly gameService = inject(GameService);

  readonly isLoading = signal(false);

  readonly errorMessage = signal<string | null>(null);

  readonly actionError = signal<string | null>(null);

  readonly showInventory = signal(false);

  readonly gameState = signal<GameStateResponse | null>(null);

  readonly showNodeSelection = signal(false);

  readonly pendingSelection = signal<PendingSelectionType | null>(null);

  readonly pendingInventoryIndex = signal<number | null>(null);

  readonly requiredNodes = signal<1 | 2>(1);

  readonly GameMode = GameMode;

  readonly StatusEffectType = StatusEffectType;

  readonly gameOver = signal(false);
  
  readonly gameResult = signal<GameResult | null>(null);

  readonly mobileTab = signal<'game' | 'logs'>('game');

  readonly selectionConfig = computed<NodeSelectionConfig>(() => {
    const game = this.gameState();
    if (!game) {
      return {
        firstNodes: [],
        secondNodes: () => [],
        requiredNodes: 1
      };
    }
    switch(this.pendingSelection()) {
      case PendingSelectionType.MOVE: {
        const firstNodes = this.neighbours(game.playerNode);
        const stick = this.hasStatus(StatusEffectType.STICK);
        return {
          firstNodes,
          secondNodes: (first:NodeId) =>
            stick
            ? this.neighbours(first)
            : [],
            requiredNodes: stick ? 2 : 1
        };
      }
      case PendingSelectionType.STRIKE:
        return {
          firstNodes: [
            NodeId.A,
            NodeId.B,
            NodeId.C,
            NodeId.D,
            NodeId.E,
            NodeId.F,
            NodeId.G
          ],
          secondNodes:()=>[],
          requiredNodes:1
        };
      case PendingSelectionType.USE_ITEM: {
        const item =
        this.itemBeingUsed();
        switch(item){
          case ItemType.BEARTRAP:
            return {
              firstNodes:[
                NodeId.A,
                NodeId.B,
                NodeId.C,
                NodeId.D,
                NodeId.E,
                NodeId.F,
                NodeId.G
              ],
              secondNodes:()=>[],
              requiredNodes:1
              };
          case ItemType.WIRE:
            return {
              firstNodes:[
                NodeId.A,
                NodeId.B,
                NodeId.C,
                NodeId.D,
                NodeId.E,
                NodeId.F,
                NodeId.G
              ],
              secondNodes:(first:NodeId)=> this.neighbours(first),
              requiredNodes:2
            };
          default:
            return {
              firstNodes:[],
              secondNodes:()=>[],
              requiredNodes:1
            };
        }
      }
      default:
        return {
          firstNodes:[],
          secondNodes:()=>[],
          requiredNodes:1
        };
    }
  });

  readonly allStatuses = [
    StatusEffectType.TRAPPED,
    StatusEffectType.STICK,
    StatusEffectType.SILENCER,
    StatusEffectType.NUKE_CHARGING,
    StatusEffectType.NUKE_READY,
    StatusEffectType.NAPALM_CHARGING,
    StatusEffectType.NAPALM_READY
  ];

  readonly adjacency = new Map<NodeId, NodeId[]>([
    [NodeId.A,[NodeId.B,NodeId.C]],
    [NodeId.B,[NodeId.A,NodeId.C,NodeId.F]],
    [NodeId.C,[NodeId.A, NodeId.B, NodeId.D]],
    [NodeId.D,[NodeId.C, NodeId.E]],
    [NodeId.E,[NodeId.D, NodeId.F, NodeId.G]],
    [NodeId.F,[NodeId.B, NodeId.E, NodeId.G]],
    [NodeId.G,[NodeId.E, NodeId.F]],
  ]);

  neighbours(node: NodeId){
    return this.adjacency.get(node)!;
  }

  itemBeingUsed(): ItemType | null {

    const index = this.pendingInventoryIndex();

    if(index === null){
      return null;
    }

    return this.gameState()?.playerInventory[index] ?? null;
  }

  readonly playerHearts = computed(() => {
    const health = this.gameState()?.playerHealth ?? 0;
    return Array.from({ length: 3 }, (_, i) => i < health);
  });

  readonly bossHearts = computed(() => {
    const health = this.gameState()?.bossHealth ?? 0;
    return Array.from({ length: 3 }, (_, i) => i < health);
  });
 
  protected readonly showRecentLogs = signal(true);

  readonly displayedLogs =
  computed(() => {

      const game = this.gameState();

      if(!game){
          return [];
      }

      if(!this.showRecentLogs()){
          return game.logs;
      }

      const latestTurn =
          game.turnNumber;

      return game.logs.filter(log =>
          log.turnNumber >= latestTurn - 2
      );

  });

  logClass(type: LogType): string{

    switch(type){
      case LogType.ACTION:
        return 'log-action';
      case LogType.ITEM_USED:
        return 'log-used';
      case LogType.ITEM_FOUND:
        return 'log-found';
      case LogType.ITEM_TRIGGERED:
        return 'log-triggered';
      default:
        return 'log-system';
      }
  }

  private readonly gameId = Number(
    this.route.snapshot.paramMap.get(
        'id'
      )
    );

  hasStatus(type: StatusEffectType): boolean {
    return this.gameState()
        ?.playerStatusEffects
        .some(s => s.type === type) ?? false;
  } 

  ngOnInit(): void {
    const userId =
      this.authService.getCurrentUserId();
    if (userId === null) {
      return;
    }
    this.loadGame(
      userId
    );
  }

  private loadGame (userId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.gameService.getGameById(userId, this.gameId)
    .pipe(
        finalize(() =>
        this.isLoading.set(false)
      )
    )
    .subscribe({
      next: response => {
        this.gameState.set(
          response
        );
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          getErrorMessage(
            err,
            'Unable to load game.'
          )
        );
      }
    });
  }

  private updateGameState(observable: Observable<GameStateResponse>): void {
    this.isLoading.set(true);
    this.actionError.set(null);
    observable
      .pipe(
        finalize(() =>
          this.isLoading.set(false)
        )
      )
      .subscribe({
        next: response => {
          this.gameState.set(
            response
          );
          if(response.gameOver){
            this.gameResult.set(response.result);
            this.gameOver.set(true);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {

            this.actionError.set(
              getErrorMessage(
                err,
                'Invalid move.'
              )
            );

            return;
          }

          this.errorMessage.set(
            getErrorMessage(
              err,
              'Unable to update game.'
            )
          );
        }
      });
  }

  closeActionError(): void {
    this.actionError.set(null);
  }
  
  reloadPage(): void {
    window.location.reload();
  }

  exitGame(): void {
    this.router.navigate(['/dashboard']);
  }

  nodeSelectionConfirmed(selection: {
    firstNode: NodeId;
    secondNode: NodeId | null;
  }): void {

    const userId = this.authService.getCurrentUserId();

    if (userId === null) {
      return;
    }

    this.showNodeSelection.set(false);

    switch (this.pendingSelection()) {

      case PendingSelectionType.MOVE: {

        const targetNodes = [selection.firstNode];

        if (selection.secondNode !== null) {
          targetNodes.push(selection.secondNode);
        }

        this.updateGameState(
          this.gameService.playTurn(
            userId,
            this.gameId,
            {
              actionType: ActionType.MOVE,
              targetNodes
            }
          )
        );

        break;
      }

      case PendingSelectionType.STRIKE:

        this.updateGameState(
          this.gameService.playTurn(
            userId,
            this.gameId,
            {
              actionType: ActionType.STRIKE,
              targetNodes: [selection.firstNode]
            }
          )
        );

        break;

      case PendingSelectionType.USE_ITEM: {

        const index = this.pendingInventoryIndex();

        if (index === null) {
          return;
        }

        this.sendUseItem(
          index,
          selection.firstNode,
          selection.secondNode
        );

        break;
      }

    }

    this.pendingSelection.set(null);
    this.pendingInventoryIndex.set(null);

  }

  move(){

      if(this.hasStatus(StatusEffectType.STICK)){

          this.pendingSelection.set(
              PendingSelectionType.MOVE
          );

          this.requiredNodes.set(2);

          this.showNodeSelection.set(true);

          return;

      }

      this.pendingSelection.set(
          PendingSelectionType.MOVE
      );

      this.requiredNodes.set(1);

      this.showNodeSelection.set(true);

  }

  strike(){

      this.pendingSelection.set(
          PendingSelectionType.STRIKE
      );

      this.requiredNodes.set(1);

      this.showNodeSelection.set(true);

  }

  sleep(): void {

    const userId = this.authService.getCurrentUserId();

    if (userId === null) {
      return;
    }

    this.updateGameState(

      this.gameService.playTurn(
        userId,
        this.gameId,
        {
          actionType: ActionType.SLEEP,
          targetNodes: []
        }

      )

    );

  }

  stayStill(): void {

    const userId = this.authService.getCurrentUserId();

    if (userId === null) {
      return;
    }

    this.updateGameState(

      this.gameService.playTurn(
        userId,
        this.gameId,
        {
          actionType: ActionType.STAY_STILL,
          targetNodes: []
        }

      )

    );

  }

  openInventory(): void {
    this.showInventory.set(true);
  }

  closeInventory(): void {
    this.showInventory.set(false);
  }

  private sendUseItem(
      index:number,
      firstNode:NodeId|null,
      secondNode:NodeId|null
  ):void{

      const userId =
          this.authService.getCurrentUserId();

      if(userId===null){
          return;
      }

      this.updateGameState(
          this.gameService.useItem(
              userId,
              this.gameId,
              {
                  inventoryIndex:index,
                  firstNode,
                  secondNode
              }
          )
      );
  }  

  useItem(index: number): void {

    const item = this.gameState()!.playerInventory[index];
        
    switch(item){

      case ItemType.BEARTRAP:

        this.showInventory.set(false);
  
        this.pendingSelection.set(
          PendingSelectionType.USE_ITEM
        );

        this.requiredNodes.set(1);

        this.pendingInventoryIndex.set(index);

        this.showNodeSelection.set(true);
      break;

      case ItemType.WIRE:
        
        this.showInventory.set(false);
  
        this.pendingSelection.set(
          PendingSelectionType.USE_ITEM
        );

        this.requiredNodes.set(2);

        this.pendingInventoryIndex.set(index);

        this.showNodeSelection.set(true);
      
        break;

      default:  
        this.showInventory.set(false);
        this.sendUseItem(index, null, null);
    }
  }

  forgetItem(index: number): void {

    const userId =
    this.authService.getCurrentUserId();

    if (userId === null) {
      return;
    }

    this.updateGameState(

      this.gameService.forgetItem(
        userId,
        this.gameId,
        {
            inventoryIndex:index,
            firstNode:null,
            secondNode:null
        }
      )
    );
  }
    
  @ViewChild('logsContainer')
  private logsContainer?: ElementRef<HTMLDivElement>;
  
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent){
    if(this.showNodeSelection() || this.showInventory()){
      return;
    }
    switch(event.key){
      case 'Escape':
        this.exitGame();
        event.preventDefault();
        break;
      case 'a':
      case 'A':
        this.move();
        break;
      case 's':
      case 'S':
        this.strike();
        break;
      case 'd':
      case 'D':
        this.sleep();
        break;
      case 'f':
      case 'F':
        this.openInventory();
        break;
      case 'l':
      case 'L':
        this.showRecentLogs.set(
          !this.showRecentLogs()
        );
        break;
      case 'ArrowDown':
        this.logsContainer?.nativeElement.scrollBy({
          top: 25,
          behavior: 'smooth'
        });
        event.preventDefault();
        break;

      case 'ArrowUp':
        this.logsContainer?.nativeElement.scrollBy({
          top: -25,
          behavior: 'smooth'
        });
        event.preventDefault();
        break;
    }
  }
}