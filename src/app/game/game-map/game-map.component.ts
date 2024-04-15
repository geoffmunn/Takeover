import { Component, AfterViewInit, ElementRef, Renderer2} from '@angular/core';

@Component({
  selector: 'app-game-map',
  standalone: true,
  imports: [],
  templateUrl: 'game-map.component.html',
  styleUrl: 'game-map.component.css'
})
export class GameMapComponent implements AfterViewInit  {

  ngAfterViewInit(): void {
    var buildings = this.el.nativeElement.querySelectorAll('div.building');

    buildings.forEach((building: any) => {
      this.renderer.addClass(building, 'geoff')
      
    })
    
	}

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
