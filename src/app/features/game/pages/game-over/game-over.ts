import { Component, input, output } from '@angular/core';
import { GameResult } from '../../models/game-result';

@Component({
  selector: 'app-game-over',
  imports: [],
  templateUrl: './game-over.html',
  styleUrl: './game-over.css',
})
export class GameOverComponent{
  protected readonly GameResult = GameResult;
  readonly result=input.required<GameResult>();
  readonly returnDashboard=output<void>();
}
