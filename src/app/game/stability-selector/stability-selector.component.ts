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

  @Input()
  title: string = '';

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  select($event: MatRadioChange) {
    this.change.emit($event.value);
  }
}
