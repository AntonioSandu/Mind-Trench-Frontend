import { Component, computed, input, output, signal, effect } from '@angular/core';
import { NodeId } from '../../models/node-id';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { A11yModule } from '@angular/cdk/a11y';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-node-selection',
  imports: [DragDropModule, A11yModule],
  templateUrl: './node-selection.html',
  styleUrl: './node-selection.css'
})
export class NodeSelectionComponent {

  readonly requiredNodes = input<1 | 2>(1);

  readonly availableFirstNodes = input.required<NodeId[]>();

  readonly secondNodesProvider = input.required<(first:NodeId)=>NodeId[]>();

  readonly currentFirstNodes = computed(() =>
    this.availableFirstNodes()
  );

  readonly currentSecondNodes = computed(() =>
    this.secondNodesProvider()(this.firstNode())
  );

  readonly activePicker = signal<1 | 2>(1);

  readonly confirm = output<{
    firstNode: NodeId;
    secondNode: NodeId | null;
  }>();
  readonly cancel = output<void>();

  readonly firstNode = signal(NodeId.A);
  readonly secondNode = signal(NodeId.A);

  constructor(){
    effect(()=>{
      const available = this.currentSecondNodes();
      if(available.length === 0){
        this.secondNode.set(NodeId.A);
        return;
      }
      if(!available.includes(this.secondNode())){
        this.secondNode.set(
          available[0]
        );
      }
    });
  }

  ngOnInit():void {
    const first = this.currentFirstNodes()[0];
    if(first){ this.firstNode.set(first); }
    const second = this.currentSecondNodes()[0];
    if(second){ this.secondNode.set(second);}
  }

  private cycle(current: NodeId, values: NodeId[], direction: number): NodeId {
    let index = values.indexOf(current);
    index += direction;
    if(index < 0){
      index = values.length - 1;
    }
    if(index >= values.length){
      index = 0;
    }
    return values[index];
  }

  previous(which:1|2):void {
    if(which === 1){
      this.firstNode.set(
        this.cycle(
          this.firstNode(),
          this.currentFirstNodes(),
          -1
        )
      );
    }
    else{
      this.secondNode.set(
        this.cycle(
          this.secondNode(),
          this.currentSecondNodes(),
          -1
        )
      );
    }
  }

  next(which:1|2):void {
    if(which === 1){
      this.firstNode.set(
        this.cycle(
          this.firstNode(),
          this.currentFirstNodes(),
          1
        )
      );
    }
    else{
      this.secondNode.set(
        this.cycle(
          this.secondNode(),
          this.currentSecondNodes(),
          1
        )
      );
    }
  }

  submit(): void {
    this.confirm.emit({
      firstNode: this.firstNode(),
      secondNode:
        this.requiredNodes() === 2
          ? this.secondNode()
          : null
    });
  }

  close(): void {
    this.cancel.emit();
  }
  
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent){
    switch(event.key){
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.previous(this.activePicker());
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.next(this.activePicker());
        event.preventDefault();
        break;
      case ' ':
        this.submit();
        event.preventDefault();
        break;
      case 'ArrowDown':
        if(this.requiredNodes() === 2){
          this.activePicker.set(2);
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.activePicker.set(1);
        event.preventDefault();
        break;
    }
  }

}