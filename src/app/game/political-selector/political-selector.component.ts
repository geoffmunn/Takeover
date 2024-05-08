import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'political-selector',
  templateUrl: 'political-selector.component.html',
  styleUrl: 'political-selector.component.css',
  standalone: true,
  imports: [],
})

export class PoliticalSelection {
  //politicalSelection!: string;
  govtTypes: string[] = ['Communist', 'Socialist', 'Liberal', 'Rightwing', 'Fascist'];

  @Input() title: string = '';

  @Input() group: string = ''

  @Output() change: EventEmitter<Event> = new EventEmitter<Event>();

  selectGovtType($event: any) {
    this.change.emit($event);

    // Change the image
    var img = $event.target.parentElement.parentElement.parentElement.parentElement.querySelector('img.politicalPoster');
    img.setAttribute('src', '/assets/posters/' + $event.target.value.toLowerCase() + '_poster.png')
  }

}