import { Component, AfterViewInit, ElementRef, Renderer2} from '@angular/core';
import { BuildingsService } from '../services/buildings.service';

@Component({
  selector: 'app-game-map',
  standalone: true,
  imports: [],
  templateUrl: 'game-map.component.html',
  styleUrl: 'game-map.component.css',
})
export class GameMapComponent implements AfterViewInit  {

  ngAfterViewInit(): void {
    var buildings = this.el.nativeElement.querySelectorAll('div.building');

    buildings.forEach((building: any) => {
      this.renderer.addClass(building, 'geoff')
      //newDiv = this.renderer.createElement()
      // let div = this.renderer.createElement('div');
      // let p = this.renderer.createElement('p')
      // let text = this.renderer.createText('TESTTEST')
      // this.renderer.appendChild(p, text)
      // this.renderer.appendChild(div, p)


      //this.renderer.appendChild(building, div)
    })
    
	}

  constructor(private buildings: BuildingsService, private el: ElementRef, private renderer: Renderer2) {
    //this.buildings = service

    
    
  }
}
