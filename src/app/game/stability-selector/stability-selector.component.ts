import {Component, Input, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'stability-selector',
  templateUrl: 'stability-selector.component.html',
  styleUrl: 'stability-selector.component.css',
  standalone: true,
  imports: [FormsModule],
})

export class StabilitySelection implements AfterViewInit {
  politicalStability!: string;
  govtStabilities: string[] = ['Very weak & about to fall', 'Weak & unpopular', 'Reasonably secure', 'Stable & strong', 'Very secure & highly popular'];

  @Input() title: string = '';
  @Input() group: string = ''

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  selectStability($event: any) {    
    this.change.emit($event.target.value)
  }

  ngAfterViewInit(){
    var firstStability = this.el.nativeElement.querySelector("input.stability-selector-radio-button[value='Very weak & about to fall']");
    firstStability.checked = true
    this.change.emit(firstStability.value);
  }

  constructor(private el: ElementRef) {
  }
}
