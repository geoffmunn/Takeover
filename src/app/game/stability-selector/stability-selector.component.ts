import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'stability-selector',
  templateUrl: 'stability-selector.component.html',
  styleUrl: 'stability-selector.component.css',
  standalone: true,
  imports: [MatRadioModule, FormsModule],
})

export class StabilitySelection {
  politicalStability!: string;
  govtStabilities: string[] = ['Very weak & about to fall', 'Weak & unpopular', 'Reasonably secure', 'Stable & strong', 'Very secure & highly popular'];

  @Input() title: string = '';
  @Input() group: string = ''

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  selectStability($event: any) {
    console.log('selected stability:', $event.target.value)
    
    this.change.emit($event.target.value)
  }
}
