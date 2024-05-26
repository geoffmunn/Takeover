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
  @Output() popularityChange = new EventEmitter();

  // Shared variables
  govt_ownership: number    = 1;
  grid:any                  = new Array();
  neutral_ownership: number = 0;
  rebel_ownership: number   = -1;
  max_moves: number         = 4;
  remaining_moves: number   = this.max_moves;
  current_player: PlayerService = this.user;

  // async waitForPromise() {
  //   // let result = await any Promise, like:
  //   let result: Promise<string> = await Promise.resolve('this is a sample promise');
  // }

  
  
  // async myFunc() {

  //   console.log('starting async function')
  //   const wait5s = () => {
  //     return new Promise<void>(resolve => {
  //       console.log('blah blah blah')
  //       setTimeout(() => resolve(), 5000)
  //     })
  //   }
    
  //   await wait5s()
  //   // Call you method here
  //   console.log('finished')
  // }
  
  /**
   * Activate the selected building.
   * 
   * @param $event 
   * 
   * @returns Promise<boolean>
   */
  async activateBuilding(building:BuildingService): Promise<boolean>{

    // Get the HTML element
    var rows: Array<HTMLElement> =  this.el.nativeElement.querySelectorAll('section#map div.row')
    var cols: any = rows[building.grid['y']].querySelectorAll('div.cell')
    var curEl: HTMLElement = cols[building.grid['x']]

    // Animate this building while we type the intelligence message
    this.renderer.addClass(curEl, 'inProgress');

    // Get the coordinates of this building
    var x: number = parseInt(building.grid['x'])
    var y: number = parseInt(building.grid['y'])

    // Values we need to figure out if the building will make the switch
    var squareMood: number = this.calculateMood(x, y)
    var liklihood: number  = building.calculateLiklihood(this.user.popularity, this.govt.popularity, squareMood)
    var comparison: number = Math.floor(Math.random()*3 + 2) 

    // Hide the activate button.
    const activate:HTMLElement = curEl.querySelector('p.activateBuilding')!
    this.renderer.addClass(activate, 'hide')
    
    var result: boolean;  // Depending on the result, we will return a value

    if (liklihood < comparison){

      this.messageChange.emit({'msg': 'The ' + building.name + ' votes to join the revolution!'});

      const wait5s = () => {        
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), 5000);
        })
      }

      await wait5s();

      this.grid[y][x]['owner'] = this.rebel_ownership;
      building.owner = this.rebel_ownership;

      this.updatePopularity(0.125, -0.125);
      
      this.renderer.removeClass(curEl, 'inProgress');

      this.renderer.removeClass(curEl, 'neutral');
      this.renderer.removeClass(curEl, this.govt.position.css);
      this.renderer.addClass(curEl, this.user.position.css);

      if (this.current_player.player = 'user'){
        result = true;
      } else {
        result = false;
      }

    } else if (liklihood > comparison){

      this.messageChange.emit({'msg': 'The ' + building.name + ' sides with the Government forces!'});

      const wait5s = () => {        
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), 5000);
        })
      }
      await wait5s();

      this.grid[y][x]['owner'] = this.govt_ownership;
      building.owner = this.govt_ownership;

      this.updatePopularity(-0.125, 0.125);

      this.renderer.removeClass(curEl, 'inProgress');

      this.renderer.removeClass(curEl, 'neutral');
      this.renderer.removeClass(curEl, this.user.position.css);
      this.renderer.addClass(curEl, this.govt.position.css);

      if (this.current_player.player = 'user'){
        result = false;
      } else {
        result = true;
      }

    } else {

      this.messageChange.emit({'msg': 'The ' + building.name + ' wishes to be neutral for the moment.'})

      const wait5s = () => {        
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), 5000)
        })
      }
      await wait5s()

      this.grid[y][x]['owner'] = this.neutral_ownership;
      building.owner = this.neutral_ownership

      this.updatePopularity(0, -0.15);

      this.renderer.removeClass(curEl, 'inProgress');

      this.renderer.removeClass(curEl, this.govt.position.css)
      this.renderer.removeClass(curEl, this.user.position.css)
      this.renderer.addClass(curEl, 'neutral');

      // This is a bad result for everyone:
      result = false;
    }

    return result;
  }

  /**
   * Activate the selected street. This requires a valid street parent element to be provided.
   * 
   * @param curEl The street element that was clicked
   * 
   * @returns Promise<boolean>
   */
  async activateStreet(curEl: any): Promise<boolean>{

    this.renderer.addClass(curEl, 'inProgress');

    var x: number = parseInt(curEl.getAttribute('data-col'))
    var y: number = parseInt(curEl.getAttribute('data-row'))

    // Hide the activate button.
    const activate = curEl.querySelector('img')
    this.renderer.addClass(activate, 'hide')

    var mood: number = this.calculateMood(x, y);

    var result: boolean;  // Depending on the result, we will return a value
    
    if (mood < 0){

      this.messageChange.emit({'msg':'The street joins the revolution!', 'random': Math.random()})

      const wait5s = () => {        
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), 5000)
        })
      }
      await wait5s()

      this.grid[y][x]['owner'] = this.rebel_ownership

      this.renderer.removeClass(curEl, 'inProgress');

      this.renderer.removeClass(curEl, 'neutral');
      this.renderer.removeClass(curEl, this.govt.position.css);
      this.renderer.addClass(curEl, this.user.position.css);

      if (this.current_player.player = 'user'){
        result = true;
      } else {
        result = false;
      }

      //this.updateRemainingMoves()

    } else {

      this.messageChange.emit({'msg': 'The street chooses to join the government!', 'random': Math.random()})

      const wait5s = () => {        
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), 5000)
        })
      }
      await wait5s()

      this.grid[y][x]['owner'] = this.govt_ownership

      this.renderer.removeClass(curEl, 'inProgress');
      
      this.renderer.removeClass(curEl, 'neutral');
      this.renderer.removeClass(curEl, this.user.position.css);
      this.renderer.addClass(curEl, this.govt.position.css);
      
      if (this.current_player.player = 'user'){
        result = false;
      } else {
        result = true;
      }
    }

    // //Go through each building and update the liklihood
    // for (var index=0; index < this.buildings.buildings.length; index++){
    //   let building:BuildingService = this.buildings.buildings[index]
    //   var squareMood = this.calculateMood(building.grid['x'],building.grid['y']);
    //   building.calculateLiklihood(this.user.popularity, this.govt.popularity, squareMood)
    // }
    return result

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

  computerTurn(){

    //for(var q = 0; q < 4; q++){
      /*
      FORL=1TO15					##### go through all 15 buildings
      2030 X=INT(RND(1)*5+1)*2:Y=INT(RND(1)*3+1)*2	##### randomly pick one from the list
      2035 J=B5(Y,X)					##### what is the b5 array?
      2036 IFM5(Y,X)>0THEN2030			##### if the govt. already owns this, then try again
      2038 B=M5(Y-1,X)+M5(Y+1,X)+M5(Y,X+1)+M5(Y,X-1)			##### calculate the mood of this building
      2039 B=B+M5(Y-1,X-1)+M5(Y+1,X+1)+M5(Y-1,X+1)+M5(Y+1,X-1)
      2040 B=INT(B(J)+B/2+G2-P2):IFB<1THENB=1
      2045 IFB>5THENB=5
      ##### if Q is greater than this calculated value, then activate this building.... Q is the turn number! WTF
      2050 IFB>=(5-Q/2)THEN2200			##### activate the building in questio


      */

    
    var q: number = 1
    for (var l = 0; l < this.buildings.buildings.length; l++){
      //var x = Math.random() * 5 + 1;
      //var randomBuilding: number = Math.floor(Math.random() * (this.buildings.buildings.length - 1 + 1) + 1);
      var randomBuilding: number = Math.floor(Math.random() * (this.buildings.buildings.length - 1));

      var building:BuildingService = this.buildings.buildings[randomBuilding]
      console.log('random building index:', randomBuilding)
      console.log(building)
      if (building.owner != this.govt_ownership){
        var mood: number = this.calculateMood(building.grid['x'], building.grid['y'])
        var liklihood: number  = building.calculateLiklihood(this.user.popularity, this.govt.popularity, mood)

        console.log ('mood:', mood)
        console.log ('liklihood:', liklihood)
        // console.log ((5 - (q / 2)))
        //liklihood = 5
        //if (liklihood >= (5 - (q / 2))){
        console.log ('govt activating:', building.name) 
        this.activateBuilding(building)

        this.updateRemainingMoves()
        this.updateScore()
        //}

        break;
      }
    }
    //}
  }
  
  /**
   * Returns an array of numbers betwen 0 and 14, randomised.
   * This is so we can pick random buildings.
   * 
   * @returns number[]
   */
  randomNumbers():number[]{
    
    var nums: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    
    random_numbers: number[] = [],
    i = nums.length,
    j = 0;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        random_numbers.push(nums[j]);
        nums.splice(j, 1);
    }

    return random_numbers
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

  updateRemainingMoves() {
    //this.counter = this.counter + 1;
    this.remaining_moves -= 1;
    this.movesChange.emit({'remaining_moves': this.remaining_moves, 'current_player': this.current_player});
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

    console.log('new user score:', this.user.score)
    this.scoreChange.emit({'user': this.user.score, 'govt': this.govt.score})
  }

  /**
   * The user has clicked on a building.
   * We need to find the HTML element that holds this building,
   * and then run the activation process.
   * At the end, update the remaining moves and score
   * 
   * @param $event
   */
  async userBuildingSelect($event:Event){
    var curEl: any = $event.target;

    while (!curEl.getAttribute('data-building-name'))
      curEl = curEl.parentElement
    
    var building:BuildingService = this.grid[curEl!.getAttribute('data-row')][curEl.getAttribute('data-col')]['building']

    var activation_result: boolean = await this.activateBuilding(building)
    
    this.userSelectionFollowup(activation_result)

    // //Go through each building and update the liklihood
    // for (var index=0; index < this.buildings.buildings.length; index++){
    //   let building:BuildingService = this.buildings.buildings[index]
    //   var squareMood = this.calculateMood(building.grid['x'],building.grid['y']);
    //   building.calculateLiklihood(this.user.popularity, this.govt.popularity, squareMood)
    // }

    // // Update the remaining moves and score
    // this.updateRemainingMoves()
    // this.updateScore()

    // // If the activation result was false, then switch users and reset the move count
    // // Also, if the score is now 0, then it's the government's turn
    // if (activation_result == false || this.remaining_moves == 0){
    //   this.current_player = this.govt;
    //   this.remaining_moves = this.max_moves;

    //   this.computerTurn()
    // }
    
  }

  /**
   * The user has clicked on a street.
   * We need to find the HTML element that holds this street,
   * and then run the activation process.
   * At the end, update the remaining moves and score
   * 
   * @param $event
   */
  async userStreetSelect($event: Event){
    var curEl: any = $event.target

    console.log('curEl at event level:', curEl)

    while (!curEl.getAttribute('data-col'))
      curEl = curEl.parentElement

    var activation_result: boolean = await this.activateStreet(curEl);

    this.userSelectionFollowup(activation_result)
  }

  /**
   * After the street or building has been activated, do some standard recalculations.
   * If the result was a failure, or there are no moves left, then switch players.
   * 
   * @param activation_result boolean
   * 
   * @returns void
   */
  userSelectionFollowup(activation_result: boolean): void{
    //Go through each building and update the liklihood
    for (var index=0; index < this.buildings.buildings.length; index++){
      let building:BuildingService = this.buildings.buildings[index]
      var squareMood = this.calculateMood(building.grid['x'],building.grid['y']);
      building.calculateLiklihood(this.user.popularity, this.govt.popularity, squareMood)
    }

    // Update the remaining moves and score
    this.updateRemainingMoves()
    this.updateScore()

    // If the activation result was false, then switch users and reset the move count
    // Also, if the score is now 0, then it's the government's turn
    if (activation_result == false || this.remaining_moves == 0){
      this.current_player = this.govt;
      this.remaining_moves = this.max_moves;

      this.computerTurn()
    }
  }

  ngAfterViewInit() {
    var buildingDivs = this.el.nativeElement.querySelectorAll('div.building');

    var random_numbers: number[] = this.randomNumbers()
    var count: number = 0
    buildingDivs.forEach((buildingDiv: any) => {
      let randomBuilding = this.buildings.buildings[random_numbers[count]]

      var divBuildingBackground = this.renderer.createElement('div')
      this.renderer.addClass(divBuildingBackground, 'building-background')

      var divBuildingImage = this.renderer.createElement('div')
      var buildingImg = this.renderer.createElement('img')
      this.renderer.setAttribute(buildingImg, 'src', '/assets/buildings/' + randomBuilding.image)
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
      var intelligenceText = this.renderer.createText('')
      this.renderer.addClass(intelligence, 'buildingIntelligence')
      this.renderer.appendChild(intelligence, intelligenceText)
      this.renderer.appendChild(divBuildingBackground, intelligence)

      var activate = this.renderer.createElement('p')
      var activateImg = this.renderer.createElement('img')
      this.renderer.setAttribute(activateImg, 'src', '/assets/activate_symbol.png');
      this.renderer.setAttribute(activateImg, 'width', '25');
      this.renderer.setAttribute(activateImg, 'height', '25');
      this.renderer.addClass(activate, 'activateBuilding')
      //this.renderer.addClass(activate, 'hide')
      this.renderer.appendChild(activate, activateImg)
      this.renderer.appendChild(divBuildingBackground, activate)

      this.renderer.appendChild(buildingDiv, divBuildingBackground)
      
      this.renderer.setAttribute(buildingDiv, 'data-building-name', randomBuilding.name)

      buildingDiv.addEventListener('mouseenter', this.onMouseOverBuilding.bind(this));
      activate.addEventListener('click', this.userBuildingSelect.bind(this));

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
          this.grid[y][x]['building'] = this.buildings.buildings[random_numbers[count]]
          this.buildings.buildings[random_numbers[count]].setGridCoords(x, y)
          count += 1;
        } else
					this.grid[y][x]['type'] = 'square';
			}
		}
    
    var streetDivs = this.el.nativeElement.querySelectorAll('div.street');

    streetDivs.forEach((streetDiv: any) => {
      streetDiv.addEventListener('mouseenter', this.onMouseOverStreet.bind(this));
    })

    var streetDivsImgs = this.el.nativeElement.querySelectorAll('div.street img');
    streetDivsImgs.forEach((streetImg: any) => {
      streetImg.addEventListener('click', this.userStreetSelect.bind(this));
    })

    this.user.player = 'user';
    this.govt.player = 'govt';

    this.current_player = this.user;

    this.movesChange.emit({'remaining_moves': this.remaining_moves, 'current_player': this.current_player});
	}

  onMouseOverBuilding($event: any){

    var x:number = parseInt($event.target.getAttribute('data-col'))
    var y:number = parseInt($event.target.getAttribute('data-row'))

    var building:BuildingService = this.grid[y][x]['building']

    const target = $event.target.querySelector('p.buildingIntelligence')

    target!.innerHTML = ''

    const writer = new Typewriter(target, {
      loop: false,
    })

    const activate = $event.target.querySelector('p.activateBuilding')

    if (this.grid[y][x]['owner'] == this.rebel_ownership) {
      
      this.renderer.addClass(activate, 'hide')

      target.innerHTML = 'The ' + building.name + ' has already joined the revolution.'

      // writer
      //   .type('The ' + building.name + ' has already joined the revolution.')
      //   .rest(500)
      //   .start()
    } else {
      
      this.renderer.removeClass(activate, 'hide')

      writer
        .type('The ' + building.name + ' ' + building.mood + ' join the revolution.')
        .rest(500)
        .start()
    }
  }

  onMouseOverStreet($event: any){

    var x:number = parseInt($event.target.getAttribute('data-col'))
    var y:number = parseInt($event.target.getAttribute('data-row'))

    const activate = $event.target.querySelector('img')

    if (this.grid[y][x]['owner'] == this.rebel_ownership) {
      this.renderer.addClass(activate, 'hide')
    } else {
      this.renderer.removeClass(activate, 'hide')
    }
  }

  constructor(public buildings: BuildingsService, private el: ElementRef, private renderer: Renderer2) {
    // console.log(buildings)
    // console.log(buildings.buildings.length)
    // for (var x = 0; x<3; x++){
    //   var randomBuilding = Math.floor(Math.random() * (this.buildings.buildings.length - 1 + 1) + 1);
    //   console.log ('random building:', randomBuilding)
    //   console.log (this.buildings.buildings[randomBuilding])
    // }

    
  }
}
