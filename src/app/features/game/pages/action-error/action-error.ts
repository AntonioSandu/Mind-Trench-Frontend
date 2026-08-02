import { Component, input, output } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-action-error',
  imports: [A11yModule],
  templateUrl: './action-error.html',
  styleUrl: './action-error.css',
})
export class ActionErrorComponent {

  readonly message = input<string>('');

  readonly close = output<void>();

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent){
    switch(event.key){
      case ' ':
        this.close.emit();
        event.preventDefault();
        break;
    }
  }
}