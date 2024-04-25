import { Component, AfterViewInit, ElementRef, Input, Renderer2, Output, EventEmitter} from '@angular/core';
import { BuildingsService } from '../services/buildings.service';
import { BuildingService } from '../services/building.service';
import { PlayerService } from '../services/player.service';
import Typewriter from '@philio/t-writer.js'

@Component({
  selector: 'app-game-map',
  standalone: true,
  imports: [],
  templateUrl: 'game-map.component.html',
  styleUrl: 'game-map.component.css',
})
export class GameMapComponent implements AfterViewInit  {

  @Input() user!: PlayerService
  @Input() govt!: PlayerService

  @Output() movesChange = new EventEmitter();
  @Output() messageChange = new EventEmitter();

  counter = 0;

  mapBuildings: any
  grid = new Array()
  rebel_ownership: number  = -1
  neutral_ownership: number = 0
  govt_ownership: number = 1

  updateRemainingMoves() { // You can give any function name

    this.counter = this.counter + 1;
    this.movesChange.emit(this.counter);

    //this.messageChange.emit('You did something!' + Math.random())
  }

  calculateMood(x: number, y: number){				
		var squareMood: number = 0
    
    if (y - 1 >= 0){
      console.log (this.grid);
      console.log (y-1);

      squareMood += this.grid[(y-1)][x]['owner']
      if (x - 1 >= 0){
        squareMood += this.grid[(y - 1)][x - 1]['owner']
      }

      if (x + 1 < this.grid[(y - 1)].length){
        squareMood += this.grid[(y - 1)][(x + 1)]['owner']
      }
    }
    if (y + 1 < this.grid.length){
      squareMood +=  this.grid[y + 1][x]['owner']
      if (x - 1 >= 0)
        squareMood += this.grid[y + 1][x - 1]['owner']
      
      if (x + 1 < this.grid[y + 1].length)
        squareMood +=  this.grid[y + 1][x + 1]['owner']
    }

    if ((x-1) >= 0){
      squareMood += this.grid[y][(x-1)]['owner']
    }

    if (x + 1 < this.grid[y].length){
      squareMood += this.grid[y][x+1]['owner']
    }

    
		// var b=this.grid[(y-1)][x]['owner'] + this.grid[(y+1)][x]['owner'] + this.grid[y][(x+1)]['owner'] + this.grid[y][(x-1)]['owner'];

		// b=b+this.grid[(y-1)][(x-1)]['owner'] + this.grid[(y+1)][(x+1)]['owner'] + this.grid[(y-1)][(x+1)]['owner']+ this.grid[(y+1)][(x-1)]['owner'];
			
		//return b;
    console.log ('square mood:', squareMood)
    
    return squareMood;
	}

  activateBuilding($event: any){
    console.log($event.target.parentElement.parentElement.parentElement)

    var curEl = $event.target

    while (!curEl.getAttribute('data-building-name'))
      curEl = curEl.parentElement

    console.log(curEl.getAttribute('data-building-name'))
    
    var building:BuildingService = this.grid[curEl.getAttribute('data-row')][curEl.getAttribute('data-col')]['building']
    
    console.log (building)

    console.log ('data-row:', curEl.getAttribute('data-row'))
    console.log ('data-col:', curEl.getAttribute('data-col'))

    var mood = this.calculateMood(parseInt(curEl.getAttribute('data-col')), parseInt(curEl.getAttribute('data-row')))

    // console.log (this.user)
    // console.log (this.govt)
    // console.log ('---')
    // console.log (this.user.popularity)
    // console.log (this.govt.popularity)
    // console.log ('---')
    // b=buildings[building_num]['loyalty']+b/2+govt_popularity-rebel_popularity;
    var decision = building.liklihood +(mood/2) + this.govt.popularity - this.user.popularity;

    if (decision < 0)
      decision = 0
    if (decision > 5)
      decision = 5

    console.log ('decision:', decision)
		// if(b<1)
		// 	b=1;
		// if(b>5)
		// 	b=5;

    this.messageChange.emit('You clicked on a building!')
    this.updateRemainingMoves()
  }

  activateStreet($event: any){
    console.log($event.target)

    //console.log($event.target.getAttribute('data-row'), $event.target.getAttribute('data-col'))

    var mood = this.calculateMood(parseInt($event.target.getAttribute('data-col')), parseInt($event.target.getAttribute('data-row')))


    this.messageChange.emit('You clicked on a street!')
    this.updateRemainingMoves()

  }

  ngAfterViewInit() {
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

      var intelligence = this.renderer.createElement('p')
      var intelligenceText = this.renderer.createText('This building probably won\'t join the revolution!')
      this.renderer.addClass(intelligence, 'buildingIntelligence')
      this.renderer.appendChild(intelligence, intelligenceText)
      this.renderer.appendChild(divBuildingBackground, intelligence)

      var activate = this.renderer.createElement('p')
      var activateText = this.renderer.createText('Activate building')
      this.renderer.addClass(activate, 'activateBuilding')
      this.renderer.appendChild(activate, activateText)
      this.renderer.appendChild(divBuildingBackground, activate)

      this.renderer.appendChild(buildingDiv, divBuildingBackground)
      
      this.renderer.setAttribute(buildingDiv, 'data-building-name', randomBuilding.name)

      buildingDiv.addEventListener('mouseenter', this.onMouseOver.bind(this));

      count += 1

    })

    // Set up the grid object. This is what we use to calculate moves and ownerships
    count = 0;
    for(var y=0; y<7; y++){
			this.grid[y] = new Array();
			for(var x = 0; x < 11; x ++){
			  this.grid[y][x] = new Array();
				this.grid[y][x]['owner'] = this.neutral_ownership;
        if (y % 2 == 1 && x % 2 == 1){
					this.grid[y][x]['type'] = 'building';
          this.grid[y][x]['building'] = this.buildings.buildings[randomNums[count]]
          count += 1;
        } else
					this.grid[y][x]['type'] = 'square';
			}
		}
    
    //console.log (this.grid)

    //this.messageChange.emit('Your turn - start the revolution!')
	}

  onMouseOver($event: any){
    const target = $event.target.querySelector('p.buildingIntelligence')

    target!.innerHTML = ''

    const writer = new Typewriter(target, {
      loop: false,
      typeColor: 'blue'
    })

    writer.clearText()

    writer
      .type('this is a new message')
      .rest(500)
      .start()
  }

  constructor(public buildings: BuildingsService, private el: ElementRef, private renderer: Renderer2) {
    this.mapBuildings = buildings
  }
}
