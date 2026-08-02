import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

enum ManualSection {
    LORE,
    MAP,
    COMMANDS,
    ITEMS
}

@Component({
  selector: 'app-manual',
  templateUrl: './manual.html',
  styleUrl: './manual.css'
})
export class ManualComponent {

  private readonly router = inject(Router);

  protected readonly ManualSection = ManualSection;

  readonly currentSection =
    signal(ManualSection.LORE);

  show(section: ManualSection): void {
    this.currentSection.set(section);
  }

  close(): void {
    this.router.navigate(['/dashboard']);
  }

}