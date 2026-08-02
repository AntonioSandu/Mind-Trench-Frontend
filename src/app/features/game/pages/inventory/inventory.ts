import { Component, computed, HostListener, input, output, signal } from '@angular/core';
import { ItemType } from '../../models/item-type';
import { ITEM_INFO } from '../../models/item-info';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-inventory',
  imports: [A11yModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class InventoryComponent {

  readonly inventory = input.required<ItemType[]>();

  readonly slots = [0,1,2,3,4,5,6,7];

  readonly ITEM_INFO = ITEM_INFO;

  readonly close = output<void>();

  readonly use = output<number>();

  readonly forget = output<number>();

  readonly page = signal(0);

  readonly isCompact = signal(false);

  constructor(){
    this.isCompact.set(window.innerWidth < 992);
  }

  @HostListener('window:resize')
  onResize(){

    const compact = window.innerWidth < 992;

    this.isCompact.set(compact);

    if(!compact){
      this.page.set(0);
    }

  }

  readonly selectedIndex = signal<number | null>(null);

  readonly visibleSlots = computed(() => {

    if(!this.isCompact()){
      return this.slots;
    }

    const start = this.page() * 4;

    return this.slots.slice(start, start + 4);

  });

  readonly showPages = computed(() => 
    this.isCompact()
  );

  readonly selectedItemInfo =
    computed(() => {
      const index = this.selectedIndex();
      if(index === null){
        return null;
      }
      const item = this.inventory()[index];
      if(!item){
        return null;
      }
      return ITEM_INFO[item];
    });

  cancel(): void {
    this.close.emit();
  }

  select(index:number):void {
    this.selectedIndex.set(index);
  }

  useSelected(): void {
    const index = this.selectedIndex();
    if(index === null){
      return;
    }
    this.use.emit(index);
  }

  forgetSelected(): void {
    const index = this.selectedIndex();
    if(index === null){
      return;
    }
    this.forget.emit(index);
  }

  changePage(page:number):void {
    this.page.set(page);
    this.selectedIndex.set(null);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent){

    switch(event.key){
      case 'Escape':
        this.cancel();
        event.preventDefault();
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
        const index =
          Number(event.key)-1;
        if(index >= 0 && index < this.inventory().length){
          this.selectedIndex.set(index);
        }
        break;
      case ' ':
        this.useSelected();
        event.preventDefault();
        break;
      case 'm':
        this.forgetSelected();
        event.preventDefault;
        break;
    }
  }

}