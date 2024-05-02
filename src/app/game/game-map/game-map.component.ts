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

  @Output() movesChange = new EventEmitter();
  @Output() scoreChange = new EventEmitter();
  @Output() messageChange = new EventEmitter();
  @Output() popularityChange = new EventEmitter()

  counter = 0;

  //mapBuildings: BuildingsService
  grid = new Array()
  rebel_ownership: number  = -1
  neutral_ownership: number = 0
  govt_ownership: number = 1

  updateRemainingMoves() { // You can give any function name

    this.counter = this.counter + 1;
    this.movesChange.emit(this.counter);

    //this.messageChange.emit('You did something!' + Math.random())
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

    //console.log(building.points)

    this.user.score = 0;
    this.govt.score = 0;

    for (var y = 0; y < this.grid.length; y++){
      for (var x = 0; x < this.grid[y].length; x++){
        //console.log (this.grid[y][x])

        if (this.grid[y][x]['type'] == 'building'){
          //console.log('this is a building')
          if (this.grid[y][x]['owner'] == this.rebel_ownership){
            this.user.score += parseInt(this.grid[y][x]['building'].points)
          } else if (this.grid[y][x]['owner'] == this.govt_ownership){
            this.govt.score += parseInt(this.grid[y][x]['building'].points)
          }
        }
      }
    }
    //console.log('new score message:', {'user': this.user.score, 'govt': this.govt.score})
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

    /*
    //410 GOSUB8200
    //415 IFN1=0THEN420	##### if n=1, then this is an information request
    //416 PRINTU6$"INFORMATION ABOUT WHICH BUILDING?"
    //417 GOTO425
    //420 PRINTUF$"WHICH BUILDING DO YOU WISH TO ACTIVATE? "
    //425 PRINT"(TYPE INITIAL LETTER OF BUILDING ONLY)  "
    //430 GOSUB8000
    //435 FORJ=1TO15:IFLEFT$(B$(J),1)=A$THEN440
    //436 NEXTJ:PRINTU0$"THERE IS NO SUCH BUILDING AS '"A$"'        "
    //437 GOSUB8050:GOTO100
    //440 FORX=2TO10STEP2:FORY=2TO6STEP2
    4//41 IFB5(Y,X)=JTHEN443
    //442 NEXTY:NEXTX:GOTO100
    ##### calculate if this bulding is likely to join you...
    ##### take the square values:
    //443 B=M5(Y-1,X)+M5(Y+1,X)+M5(Y,X+1)+M5(Y,X-1)
    //444 B=B+M5(Y-1,X-1)+M5(Y+1,X+1)+M5(Y-1,X+1)+M5(Y+1,X-1)
    ##### Now take the building values (I think)
    448 B=INT(B(J)+B/2+G2-P2):IFB<1THENB=1
    449 IFB>5THENB=5  # B is the liklihood. 1=low, 5=high
    450 GOSUB8200
    455 PRINTUF$"THE "B$(J)
    456 IFM5(Y,X)>=0THEN460     # If the owner is neutral or the government, then proceed
    457 PRINT"IS ALREADY ON YOUR SIDE!"
    458 GOSUB8050:GOTO100
    460 PRINT""WF$(B);" JOIN THE REBELS."     # This is the intelligence message (the palace probably won't join the rebels etc)
    462 GOSUB8050:IFN1=1THEN100
    470 FORK=1TO3:D9$=U1$:GOSUB8110:D9$=U0$:GOSUB8110:NEXTK
    472 GOSUB8200:D9$=""
    473 K=INT(RND(1)*3+2)					##### generate a random number to decide if this activation goes ahead as planned
    474 IFB<KTHEN480        # If B (liklihood) is smaller than K (random) then we join the rebels
    475 IFB>KTHEN490        # if B (liklihood) is greater than K (random) then it joins the government
    476 PRINTUF$"THE "B$(J)
    477 PRINT"WISHES TO BE NEUTRAL FOR THE MOMENT."   # if B (liklihood) == K (random) then it remains neutral
    478 IFM5(Y,X)>0THENG3=G3-S(J):G2=G2-.15			##### deduct the points of this building off the government score, and 0.15 off the government popularity
    479 M5(Y,X)=0:GOSUB8110:GOSUB8350:GOSUB8050:GOTO1000	##### set the grid value to zero
    480 PRINTUM$"THE "B$(J)
    482 PRINT"VOTES TO JOIN THE REBELS!"
    483 P3=P3+S(J):IFM5(Y,X)>0THENG3=G3-S(J)		##### add the building points to the player's score, and if the grid score > 0 then deduct the points off the govt score
    484 M5(Y,X)=-1:GOSUB8110				##### set the grid value to -1 (rebel value)
    485 P2=P2+.125:G2=G2-.125:GOSUB8350			##### increase the player popularity by 0.125, deduct 0.125 off the government popularity
    486 GOSUB8050:GOTO198
    490 PRINTUN$"THE "B$(J)
    492 PRINT"SIDES WITH THE GOVERNMENT FORCES."
    493 G3=G3+S(J):IFM5(Y,X)<0THENP3=P3-S(J)		##### add the building points to the govt. score. if the grid value is -1, then deduct these points off the player score
    494 M5(Y,X)=1:GOSUB8110					##### set the grid value to 1
    495 G2=G2+.125:P2=P2-.125:GOSUB8350			##### add 0.125 to the govt popularity, and deduct 0.125 off the player popularity
    496 GOSUB8050:GOTO1000
    500 REM INFORMATION
    510 N1=1:GOTO400
    800 GOTO1000
    999 END
    */
    //console.log($event.target.parentElement.parentElement.parentElement)

    var curEl = $event.target

    while (!curEl.getAttribute('data-building-name'))
      curEl = curEl.parentElement

    //console.log(curEl.getAttribute('data-building-name'))
    
    var building:BuildingService = this.grid[curEl.getAttribute('data-row')][curEl.getAttribute('data-col')]['building']
    
    var x: number = parseInt(curEl.getAttribute('data-col'))
    var y: number = parseInt(curEl.getAttribute('data-row'))

    console.log (building)
  
    
    //console.log ('data-row:', curEl.getAttribute('data-row'))
    //console.log ('data-col:', curEl.getAttribute('data-col'))


    var mood = this.calculateMood(x, y)

    // b=buildings[building_num]['loyalty']+b/2+govt_popularity-rebel_popularity;
    console.log('user popularity:', this.user.popularity, 'govt popularity:', this.govt.popularity)
    var liklihood = building.liklihood +(mood / 2) + this.govt.popularity - this.user.popularity;

    if (liklihood < 0)
      liklihood = 0
    if (liklihood > 5)
      liklihood = 5

    //building.liklihood = liklihood
    //building.setMood('wants to party')

    console.log ('liklihood:', liklihood)

    //var k=(Math.random(1)*3)+1.5; 
    var comparison = Math.floor(Math.random()*3 + 2) 
    console.log ('comparison:', comparison)

    if (liklihood < comparison){
      console.log ('decides to join!')
      //TODO: the success/failure messages don't show!
      console.log(this.grid[y][x])
      this.messageChange.emit('The ' + building.name + ' votes to join the revolution!')

      this.grid[y][x]['owner'] = this.rebel_ownership;

      //483 P3=P3+S(J):IFM5(Y,X)>0THENG3=G3-S(J)		##### add the building points to the player's score, and if the grid score > 0 then deduct the points off the govt score
      //484 M5(Y,X)=-1:GOSUB8110				##### set the grid value to -1 (rebel value)
      //485 P2=P2+.125:G2=G2-.125:GOSUB8350			##### increase the player popularity by 0.125, deduct 0.125 off the government popularity

      this.updatePopularity(0.125, -0.125)

      console.log(this.user.position)
      this.renderer.removeClass(curEl, 'neutral')
      this.renderer.removeClass(curEl, this.govt.position.css)
      this.renderer.addClass(curEl, this.user.position.css);

    } else if (liklihood > comparison){
      console.log ('will NOT join!')
      // if(grid[y][x]['owner']!=govt_ownership){
      //   showMessage('The ' + buildings[building_num]['name'] + ' sides with the Government forces.');
      //   setTimeout(function(){
      //     govt_score+=buildings[building_num]['points'];
      //     if(grid[y][x]['owner']==rebel_ownership){
      //       rebel_popularity-=buildings[building_num]['points'];
      //     }
      //     grid[y][x]['owner']=govt_ownership;
      //     govt_popularity+=0.125;
      //     rebel_popularity-=0.125;
          
      //     updateClasses(cell, govt_colour);
      //     finishBuildingActivation(false, player);
      //   }, 4000);
      // } else {
      //   showMessage('The ' + buildings[building_num]['name'] + ' refuses to switch sides!');
      //   setTimeout(function(){
      //     finishBuildingActivation(false, player);
      //   }, 4000);
      // }

      //493 G3=G3+S(J):IFM5(Y,X)<0THENP3=P3-S(J)		##### add the building points to the govt. score. if the grid value is -1, then deduct these points off the player score
      //494 M5(Y,X)=1:GOSUB8110					##### set the grid value to 1
      //495 G2=G2+.125:P2=P2-.125:GOSUB8350			##### add 0.125 to the govt popularity, and deduct 0.125 off the player popularity

      this.messageChange.emit('The ' + building.name + ' sides with the Government forces!')

      this.grid[y][x]['owner'] = this.govt_ownership;

      this.updatePopularity(-0.125, 0.125)


      console.log(this.govt.position)
      this.renderer.removeClass(curEl, 'neutral');
      this.renderer.removeClass(curEl, this.user.position.css);
      this.renderer.addClass(curEl, this.govt.position.css);
      // We will update the score at the end


    } else {
      console.log ('wishes to remain neutral')
      //b = k, TODO: need to check how likely this actually is, do we need to round down the numbers?
      // showMessage('The ' + buildings[building_num]['name'] + ' wishes to remain neutral for the moment.');
      // setTimeout(function(){
      //   //NOTE: failure to switch sides ONLY affects government popularity
      //   if(grid[y][x]['owner']==govt_ownership){
      //     //This basically means that the building is being lost by the owner, but not gained by the contender
      //     govt_score-=buildings[building_num]['points'];
      //     govt_popularity-=0.15;
      //   }
      //   grid[y][x]['owner']=neutral_ownership;
        
      //   updateClasses(cell, 'neutral');
      //   finishBuildingActivation(false, player);
      // }, 4000);

      //IFM5(Y,X)>0THENG3=G3-S(J):G2=G2-.15			##### deduct the points of this building off the government score, and 0.15 off the government popularity
      //479 M5(Y,X)=0:GOSUB8110:GOSUB8350:GOSUB8050:GOTO1000	##### set the grid value to zero

      //477 PRINT"WISHES TO BE NEUTRAL FOR THE MOMENT."   # if B (liklihood) == K (random) then it remains neutral
      //478 IFM5(Y,X)>0THENG3=G3-S(J):G2=G2-.15			##### deduct the points of this building off the government score, and 0.15 off the government popularity
      //479 M5(Y,X)=0:GOSUB8110:GOSUB8350:GOSUB8050:GOTO1000	##### set the grid value to zero

      this.messageChange.emit('The ' + building.name + ' wishes to be neutral for the moment.')

      this.grid[y][x]['owner'] = this.neutral_ownership;

      this.updatePopularity(0, -0.15);

      this.renderer.removeClass(curEl, this.govt.position.css)
      this.renderer.removeClass(curEl, this.user.position.css)
      this.renderer.addClass(curEl, 'neutral');


      //this.mapBuildings.calculateLiklihoods(this.govt.popularity, this.govt.politicalType, this.user.popularity, this.user.politicalType)
      
    }

		// if(b<1)
		// 	b=1;
		// if(b>5)
		// 	b=5;

    //this.messageChange.emit('You clicked on a building!')
    //building.calculateLiklihood(this.user.popularity, this.user.politicalType, this.govt.popularity, this.govt.politicalType)


    //console.log('before:', this.buildings)
    this.buildings.updateLiklihoods(this.user.popularity, this.user.politicalType, this.govt.popularity, this.govt.politicalType)
    //console.log('after:', this.buildings)
    this.updateRemainingMoves()
    this.updateScore()
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

      buildingDiv.addEventListener('mouseenter', this.onMouseOver.bind(this));
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
          count += 1;
        } else
					this.grid[y][x]['type'] = 'square';
			}
		}
    
    //console.log (this.grid)

    //this.messageChange.emit('Your turn - start the revolution!')
	}

  onMouseOver($event: any){
    //console.log ($event)

    var x:number = parseInt($event.target.getAttribute('data-col'))
    var y:number = parseInt($event.target.getAttribute('data-row'))

    var building:BuildingService = this.grid[y][x]['building']
    //console.log(building)

    const target = $event.target.querySelector('p.buildingIntelligence')

    target!.innerHTML = ''

    const writer = new Typewriter(target, {
      loop: false,
      /*typeColor: 'blue'*/
    })

    writer.clearText()

    writer
      .type('The ' + building.name + ' ' + building.mood + ' join the revolution.')
      .rest(500)
      .start()
  }

  constructor(public buildings: BuildingsService, private el: ElementRef, private renderer: Renderer2) {
    //this.mapBuildings = buildings
  }
}
