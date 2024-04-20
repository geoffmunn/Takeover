import { Component, AfterViewInit, ElementRef, Renderer2, Output, EventEmitter} from '@angular/core';
import { BuildingsService } from '../services/buildings.service';

@Component({
  selector: 'app-game-map',
  standalone: true,
  imports: [],
  templateUrl: 'game-map.component.html',
  styleUrl: 'game-map.component.css',
})
export class GameMapComponent implements AfterViewInit  {

  @Output() valueChange = new EventEmitter();
  counter = 0;

  mapBuildings: any

  valueChanged() { // You can give any function name

    this.counter = this.counter + 1;
    this.valueChange.emit(this.counter);
  }

  activateBuilding($event: any){
    console.log($event.target.parentElement.parentElement.parentElement)

    var curEl = $event.target

    while (!curEl.getAttribute('data-building-name'))
      curEl = curEl.parentElement

    console.log(curEl.getAttribute('data-building-name'))
    
    this.valueChanged()
  }

  ngAfterViewInit(): void {
    var buildingDivs = this.el.nativeElement.querySelectorAll('div.building');

    var nums = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    randomNums: number[] = [],
    i = nums.length,
    j = 0;

    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        randomNums.push(nums[j]);
        nums.splice(j,1);
    }

    var count: number = 0
    buildingDivs.forEach((buildingDiv: any) => {
      let randomBuilding = this.buildings.buildings[randomNums[count]]

      var divBuildingBackground = this.renderer.createElement('div')
      this.renderer.addClass(divBuildingBackground, 'building-background')

      var divBuildingImage = this.renderer.createElement('div')
      var buildingImg = this.renderer.createElement('img')
      this.renderer.setAttribute(buildingImg, 'src', '/assets/' + randomBuilding.image)
      this.renderer.setAttribute(buildingImg, 'width', '75')
      this.renderer.addClass(divBuildingImage, 'building-image')
      this.renderer.appendChild(divBuildingImage, buildingImg)
      this.renderer.appendChild(divBuildingBackground, divBuildingImage)

      var divBuildingName = this.renderer.createElement('div')
      this.renderer.addClass(divBuildingName, 'building-name')

      var buildingName = this.renderer.createElement('p')
      var buildingText = this.renderer.createText(randomBuilding.name)
      this.renderer.appendChild(buildingName, buildingText)
      this.renderer.appendChild(divBuildingName, buildingName)
      this.renderer.appendChild(divBuildingBackground, divBuildingName)

      var divBuildingPoints = this.renderer.createElement('div')
      this.renderer.addClass(divBuildingPoints, 'building-points')

      var buildingPoints = this.renderer.createElement('p')
      var pointsText = this.renderer.createText(randomBuilding.points)

      this.renderer.appendChild(buildingPoints, pointsText)
      this.renderer.appendChild(divBuildingPoints, buildingPoints)
      this.renderer.appendChild(divBuildingBackground, divBuildingPoints)

      this.renderer.appendChild(buildingDiv, divBuildingBackground)
      
      this.renderer.setAttribute(buildingDiv, 'data-building-name', randomBuilding.name)
      count += 1

    })
    
	}

  constructor(public buildings: BuildingsService, private el: ElementRef, private renderer: Renderer2) {
    this.mapBuildings = buildings
    
  }
}
