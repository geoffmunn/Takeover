import {AfterViewInit, Component, Input, Output, EventEmitter, ElementRef, Renderer2} from '@angular/core';

@Component({
  selector: 'political-selector',
  templateUrl: 'political-selector.component.html',
  styleUrl: 'political-selector.component.css',
  standalone: true,
  imports: [],
})

export class PoliticalSelection implements AfterViewInit {
  govt_types: string[] = ['Communist', 'Socialist', 'Liberal', 'Rightwing', 'Fascist'];

  // The heading of this political selection group
  @Input() title: string = '';
  // Used to differentiate between rebels and govt
  @Input() group: string = ''
  // Emits the form change back to the parent component
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Change the post based on the government type
   * 
   * @param parent_el
   * @param govt_type
   *  
   * @returns boolean
   */
  changeImage(parent_el: HTMLElement, govt_type: string): boolean {
    var img: HTMLIFrameElement|null = parent_el.querySelector('img.politicalPoster');
    img!.setAttribute('src', '/assets/posters/' + govt_type + '_poster.png');

    return true;
  }

  /**
   * Triggered by the 'change' event on the political selection section
   * 
   * @param $event 
   * 
   * @returns void
   */
  selectGovtType($event: any): void {
    // Change the image
    var cur_el: HTMLElement|null = $event.target;

    while (!cur_el!.classList.contains('politicalSelectorContainer'))
      cur_el = cur_el!.parentElement;

    this.changeImage(cur_el!, $event.target.value.toLowerCase());
  }

  ngAfterViewInit(){

    // Default to Communist for the rebels
    var img_parent:HTMLDivElement

    if (this.group == 'rebelsType'){
      var first_rebel: HTMLInputElement = this.el.nativeElement.querySelector("input.political-selector-radio-button[value='Communist']");
      first_rebel.checked = true;
      this.change.emit(first_rebel.value);

      
      img_parent = this.el.nativeElement.querySelector("div.posterContainer.rebelsType"); 
      this.changeImage(img_parent, first_rebel.value.toLowerCase())
    }

    // Default to Fascist for the government
    if (this.group == 'govtType'){
      var last_govt: HTMLInputElement = this.el.nativeElement.querySelector("input.political-selector-radio-button[value='Fascist']");
      last_govt.checked = true;
      this.change.emit(last_govt.value);

      img_parent = this.el.nativeElement.querySelector("div.posterContainer.govtType");       
      this.changeImage(img_parent, last_govt.value.toLowerCase())
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }
}