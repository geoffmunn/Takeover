import {Component, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'political-selector',
  templateUrl: 'political-selector.component.html',
  styleUrl: 'political-selector.component.css',
  standalone: true,
  imports: [MatRadioModule, FormsModule],
})

export class PoliticalSelection {
  politicalSelection!: string;
  seasons: string[] = ['Communist', 'Socialist', 'Liberal', 'Rightwing', 'Fascist'];

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  select($event: MatRadioChange) {
    this.change.emit($event.value);
  }
  
}