import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-game-error',
  imports: [],
  templateUrl: './game-error.html',
  styleUrl: './game-error.css',
})
export class GameErrorComponent {

  readonly message = input.required<string>();

  readonly retry = output<void>();

  readonly exit = output<void>();

}