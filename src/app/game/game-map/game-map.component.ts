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

  mapBuildings: any

  ngAfterViewInit(): void {
    var buildingDivs = this.el.nativeElement.querySelectorAll('div.building');

    var nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
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

      console.log (randomBuilding)

      this.renderer.addClass(buildingDiv, 'geoff')

      var divBuildingBackground = this.renderer.createElement('div')
      this.renderer.addClass(divBuildingBackground, 'building-background')

      var divBuildingImage = this.renderer.createElement('div')
      var buildingImg = this.renderer.createElement('img')
      this.renderer.setAttribute(buildingImg, 'src', '/assets/militaryhq.png')
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
      
      count += 1
      
      //newDiv = this.renderer.createElement()
      // let div = this.renderer.createElement('div');
      // let p = this.renderer.createElement('p')
      // let text = this.renderer.createText('TESTTEST')
      // this.renderer.appendChild(p, text)
      // this.renderer.appendChild(div, p)


      //this.renderer.appendChild(building, div)

    })
    
	}

  constructor(public buildings: BuildingsService, private el: ElementRef, private renderer: Renderer2) {
    //this.buildings = service
    this.mapBuildings = buildings
    
    
  }
}
