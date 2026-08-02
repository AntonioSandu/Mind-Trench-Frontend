import { Component, input } from '@angular/core';
import { NodeId } from '../../models/node-id';
import { GameStateResponse } from '../../models/game-state-response';
import { MapEffect } from '../../models/map-effect';
import { MapEffectType } from '../../models/map-effect-type';

interface DrawableEffect{

  x:number;
  y:number;

  sprite:string;
  type:MapEffectType;

  enemy:boolean;

  size:number;
  offsetX:number;
  offsetY:number;

  rotation:number;
}

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent {

  readonly gameState = input.required<GameStateResponse>();

  readonly MapEffectType = MapEffectType;

  readonly nodes = [
    { id: NodeId.A, x: 50, y: 80 },
    { id: NodeId.B, x: 40, y: 340 },
    { id: NodeId.C, x: 120, y: 180 },
    { id: NodeId.D, x: 150, y: 310 },
    { id: NodeId.E, x: 270, y: 260 },
    { id: NodeId.F, x: 180, y: 410 },
    { id: NodeId.G, x: 330, y: 360 }
  ];

  readonly enemyNodes = [
    { id: NodeId.A, x: 450, y: 370 }, 
    { id: NodeId.B, x: 460, y: 110 }, 
    { id: NodeId.C, x: 380, y: 270 }, 
    { id: NodeId.D, x: 350, y: 150 }, 
    { id: NodeId.E, x: 230, y: 190 }, 
    { id: NodeId.F, x: 320, y: 40 },  
    { id: NodeId.G, x: 170, y: 90 } 
  ];

  readonly edges: [NodeId, NodeId][] = [
    [NodeId.A, NodeId.B],
    [NodeId.A, NodeId.C],
    [NodeId.B, NodeId.C],
    [NodeId.C, NodeId.D],
    [NodeId.D, NodeId.E],
    [NodeId.E, NodeId.F],
    [NodeId.E, NodeId.G],
    [NodeId.F, NodeId.G],
  ];

  readonly tunnel: [NodeId, NodeId] = [
    NodeId.B,
    NodeId.F
  ];

  readonly playerCoords = new Map<NodeId,{x:number;y:number}>(
  this.nodes.map(n => [n.id,n])
  );

  readonly enemyCoords = new Map<NodeId,{x:number;y:number}>(
    this.enemyNodes.map(n => [n.id,n])
  );

  coord(node: NodeId, enemy = false){

    return enemy
      ? this.enemyCoords.get(node)!
      : this.playerCoords.get(node)!;

  }

  isEnemySideEffect(type: MapEffectType){

    switch(type){

      case MapEffectType.BEARTRAP:
      case MapEffectType.WIRE:
      case MapEffectType.NAPALM_SECOND_HIT:
        return true;

      case MapEffectType.CAMPFIRE:
      case MapEffectType.UMBRELLA:
        return false;

    }

  }

  drawableEffects(): DrawableEffect[]{

  return this.gameState()
    .playerVisibleMapEffects
    .map(effect => {

      const enemyMap = this.isEnemySideEffect(effect.type);

      let x:number;
      let y:number;
      let rotation = 0;


      if(effect.secondNode === null){

        const point = this.coord(
          effect.firstNode,
          enemyMap
        );

        x = point.x;
        y = point.y;


      }else{

        const first = this.coord(
          effect.firstNode,
          enemyMap
        );

        const second = this.coord(
          effect.secondNode,
          enemyMap
        );


        x = (first.x + second.x) / 2;
        y = (first.y + second.y) / 2;


        // rotation wire
        rotation =
          Math.atan2(
            second.y-first.y,
            second.x-first.x
          )
          *
          180
          /
          Math.PI-90;

      }


      const style = this.effectStyle(effect.type);


      return {

        x,
        y,

        sprite:this.effectSprite(effect)!,
        type:effect.type,

        enemy:enemyMap,

        size:style.size,
        offsetX:style.offsetX,
        offsetY:style.offsetY,

        rotation

      };

    });

  }

  effectStyle(type:MapEffectType){

    switch(type){

      case MapEffectType.WIRE:
      return {
        size:55,
        offsetX:0,
        offsetY:0
      };

      case MapEffectType.NAPALM_SECOND_HIT:
      return {
        size:45,
        offsetX:0,
        offsetY:-5
      };

      case MapEffectType.BEARTRAP:
      return {
        size:55,
        offsetX:0,
        offsetY:20
      };

      case MapEffectType.CAMPFIRE:
      return {
        size:40,
        offsetX:-20,
        offsetY:10
      };

      case MapEffectType.UMBRELLA:
      return {
        size:35,
        offsetX:0,
        offsetY:-27
      };

    }

  }

  effectSprite(effect: MapEffect) {

      switch(effect.type){

          case MapEffectType.BEARTRAP:
              return "/map/map-beartrap.svg";

          case MapEffectType.WIRE:
              return "/map/map-wire.svg";

          case MapEffectType.CAMPFIRE:
              return "/map/map-campfire.svg";

          case MapEffectType.UMBRELLA:
              return "/map/map-umbrella.svg";

          case MapEffectType.NAPALM_SECOND_HIT:
              return "/map/map-napalm.svg";
      }
  }
}
