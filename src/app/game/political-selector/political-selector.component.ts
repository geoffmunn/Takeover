import {AfterViewInit, Component, Input, Output, EventEmitter, ElementRef, Renderer2} from '@angular/core';

@Component({
  selector: 'political-selector',
  templateUrl: 'political-selector.component.html',
  styleUrl: 'political-selector.component.css',
  standalone: true,
  imports: [],
})

export class PoliticalSelection implements AfterViewInit {
  //politicalSelection!: string;
  govtTypes: string[] = ['Communist', 'Socialist', 'Liberal', 'Rightwing', 'Fascist'];

  @Input() title: string = '';

  @Input() group: string = ''

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  selectGovtType($event: any) {

    console.log('user has selected:', $event.target.value)

    this.change.emit($event.target.value);

    // Change the image
    var img = $event.target.parentElement.parentElement.parentElement.parentElement.querySelector('img.politicalPoster');
    img.setAttribute('src', '/assets/posters/' + $event.target.value.toLowerCase() + '_poster.png')
  }

  ngAfterViewInit(){

    console.log(this.group)

    if (this.group == 'rebelsType'){
      var firstRebel = this.el.nativeElement.querySelector("input.political-selector-radio-button[value='Communist']");
      console.log (firstRebel)
      firstRebel.checked = true
      this.change.emit(firstRebel.value);
    }

    if (this.group == 'govtType'){
      var lastGovt = this.el.nativeElement.querySelector("input.political-selector-radio-button[value='Fascist']");
      console.log (lastGovt.value)
      lastGovt.checked = true

      this.change.emit(lastGovt.value);
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }
}