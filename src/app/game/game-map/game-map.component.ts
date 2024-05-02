import { Component, AfterViewInit, ElementRef, Input, Renderer2, Output, EventEmitter, Inject} from '@angular/core';
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

  @Output() movesChange      = new EventEmitter();
  @Output() scoreChange      = new EventEmitter();
  @Output() messageChange    = new EventEmitter();
  @Output() popularityChange = new EventEmitter()

  counter = 0;

  //mapBuildings: BuildingsService
  grid = new Array()
  rebel_ownership: number  = -1
  neutral_ownership: number = 0
  govt_ownership: number = 1

  updateRemainingMoves() {
    this.counter = this.counter + 1;
    this.movesChange.emit(this.counter);
  }

  updatePopularity(userChange: number, govtChange: number) {
    this.user.popularity += userChange
    this.govt.popularity += govtChange

    if (this.user.popularity < 0) {
      this.user.popularity = 0
    }
    if (this.govt.popularity < 0) {
      this.govt.popularity = 0
    }

    this.popularityChange.emit({'user': this.user.popularity, 'govt': this.govt.popularity})
  }

  updateScore() {
    // It's not great, but we'll cycle through all the buildings and calculate the correct scores for both players

    this.user.score = 0;
    this.govt.score = 0;

    for (var index=0; index < this.buildings.buildings.length; index++){
      let building = this.buildings.buildings[index]
      
      if (building.owner == this.rebel_ownership)
        this.user.score += building.points
      else if (building.owner == this.govt_ownership)
        this.govt.score += building.points
    }

    this.scoreChange.emit({'user': this.user.score, 'govt': this.govt.score})
  }

  calculateMood(x: number, y: number){				
		var squareMood: number = 0
    
    if (y - 1 >= 0){
      //console.log (this.grid);
      //console.log (y-1);

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
      if (x - 1 >= 0){
        squareMood += this.grid[y + 1][x - 1]['owner']
      }
      if (x + 1 < this.grid[y + 1].length){
        squareMood +=  this.grid[y + 1][x + 1]['owner']
      }
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
    //console.log ('square mood:', squareMood)
    
    return squareMood;
	}

  activateBuilding($event: any){

    var curEl = $event.target

    while (!curEl.getAttribute('data-building-name'))
      curEl = curEl.parentElement

    //console.log(curEl.getAttribute('data-building-name'))
    
    var building:BuildingService = this.grid[curEl.getAttribute('data-row')][curEl.getAttribute('data-col')]['building']
    
    var x: number = parseInt(curEl.getAttribute('data-col'))
    var y: number = parseInt(curEl.getAttribute('data-row'))

    var squareMood: number = this.calculateMood(x, y)
    var liklihood: number = building.calculateLiklihood(this.user.popularity, this.govt.popularity, squareMood)
    var comparison: number = Math.floor(Math.random()*3 + 2) 

    if (liklihood < comparison){
      //TODO: the success/failure messages don't show!
      this.messageChange.emit('The ' + building.name + ' votes to join the revolution!')

      this.grid[y][x]['owner'] = this.rebel_ownership;
      building.owner = this.rebel_ownership

      this.updatePopularity(0.125, -0.125)

      this.renderer.removeClass(curEl, 'neutral')
      this.renderer.removeClass(curEl, this.govt.position.css)
      this.renderer.addClass(curEl, this.user.position.css);

    } else if (liklihood > comparison){    
      this.messageChange.emit('The ' + building.name + ' sides with the Government forces!')

      this.grid[y][x]['owner'] = this.govt_ownership;
      building.owner = this.govt_ownership

      this.updatePopularity(-0.125, 0.125)

      this.renderer.removeClass(curEl, 'neutral');
      this.renderer.removeClass(curEl, this.user.position.css);
      this.renderer.addClass(curEl, this.govt.position.css);
    } else {
      this.messageChange.emit('The ' + building.name + ' wishes to be neutral for the moment.')

      this.grid[y][x]['owner'] = this.neutral_ownership;
      building.owner = this.neutral_ownership

      this.updatePopularity(0, -0.15);

      this.renderer.removeClass(curEl, this.govt.position.css)
      this.renderer.removeClass(curEl, this.user.position.css)
      this.renderer.addClass(curEl, 'neutral');
    }

    //Go through each building and update the liklihood
    for (var index=0; index < this.buildings.buildings.length; index++){
      let building:BuildingService = this.buildings.buildings[index]
      var squareMood = this.calculateMood(building.grid['x'],building.grid['y']);
      building.calculateLiklihood(this.user.popularity, this.govt.popularity, squareMood)
    }

    this.updateRemainingMoves()
    this.updateScore()

  }

  activateStreet($event: any){

    var curEl = $event.target

    var x: number = parseInt($event.target.getAttribute('data-col'))
    var y: number = parseInt($event.target.getAttribute('data-row'))

    var mood: number = this.calculateMood(x, y);

    if (mood < 0){
      this.grid[y][x]['owner'] = this.rebel_ownership

      this.renderer.removeClass(curEl, 'neutral')
      this.renderer.removeClass(curEl, this.govt.position.css)
      this.renderer.addClass(curEl, this.user.position.css);
    } else {
      this.grid[y][x]['owner'] = this.govt_ownership

      this.renderer.removeClass(curEl, 'neutral');
      this.renderer.removeClass(curEl, this.user.position.css);
      this.renderer.addClass(curEl, this.govt.position.css);
    }

    //Go through each building and update the liklihood
    for (var index=0; index < this.buildings.buildings.length; index++){
      let building:BuildingService = this.buildings.buildings[index]
      var squareMood = this.calculateMood(building.grid['x'],building.grid['y']);
      building.calculateLiklihood(this.user.popularity, this.govt.popularity, squareMood)
    }

    this.updateRemainingMoves()
    this.updateScore()

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
      this.renderer.setAttribute(buildingImg, 'width', '100')
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

      buildingDiv.addEventListener('mouseenter', this.onMouseOverBuilding.bind(this));
      activate.addEventListener('click', this.activateBuilding.bind(this));

      count += 1;

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
          this.buildings.buildings[randomNums[count]].setGridCoords(x, y)
          count += 1;
        } else
					this.grid[y][x]['type'] = 'square';
			}
		}
    
    //console.log (this.grid)

    //this.messageChange.emit('Your turn - start the revolution!')

    var streetDivs = this.el.nativeElement.querySelectorAll('div.street');

    streetDivs.forEach((streetDiv: any) => {
      streetDiv.addEventListener('mouseenter', this.onMouseOverStreet.bind(this));
      streetDiv.addEventListener('click', this.activateStreet.bind(this));
    })
	}

  onMouseOverBuilding($event: any){
    //console.log ($event)

    var x:number = parseInt($event.target.getAttribute('data-col'))
    var y:number = parseInt($event.target.getAttribute('data-row'))

    var building:BuildingService = this.grid[y][x]['building']
    //console.log(building)

    const target = $event.target.querySelector('p.buildingIntelligence')

    target!.innerHTML = ''

    const writer = new Typewriter(target, {
      loop: false,
    })

    const activate = $event.target.querySelector('p.activateBuilding')
    //console.log(activate)
    if (this.grid[y][x]['owner'] == this.rebel_ownership) {
      
      this.renderer.addClass(activate, 'hide')

      writer
        .type('The ' + building.name + ' has already joined the revolution.')
        .rest(500)
        .start()
    } else {
      
      this.renderer.removeClass(activate, 'hide')

      writer
        .type('The ' + building.name + ' ' + building.mood + ' join the revolution.')
        .rest(500)
        .start()
    }
  }

  onMouseOverStreet($event: any){
    //console.log ('over street!')
  }

  constructor(public buildings: BuildingsService, private el: ElementRef, private renderer: Renderer2) {
    //this.mapBuildings = buildings
  }
}
