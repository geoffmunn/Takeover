import { Component, AfterViewInit, ElementRef, Input, Renderer2, Output, EventEmitter, Inject} from '@angular/core';
import { BuildingsService } from '../services/buildings.service';
import { BuildingService } from '../services/building.service';
import { PlayerService } from '../services/player.service';
import Typewriter from '@philio/t-writer.js'
import { StreetService } from '../services/street.service';

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
  current_player: PlayerService = this.user;
  govt_ownership: number        = 1;
  grid:any                      = new Array();
  neutral_ownership: number     = 0;
  rebel_ownership: number       = -1;
  max_moves: number             = 4;
  remaining_moves: number       = this.max_moves;
  streets: StreetService[]      = []

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
    var cur_el: HTMLElement = cols[building.grid['x']]

    // Animate this building while we type the intelligence message
    this.renderer.addClass(cur_el, 'inProgress');

    // Get the coordinates of this building
    var x: number = Number(building.grid['x'])
    var y: number = Number(building.grid['y'])

    // Values we need to figure out if the building will make the switch
    var square_mood: number = this.calculateMood(x, y)
    var liklihood: number  = building.calculateLiklihood(this.user.popularity, this.govt.popularity, square_mood)
    var comparison: number = Math.floor(Math.random() * 3 + 2) 

    // Hide the activate button.
    const activate:HTMLElement = cur_el.querySelector('p.activateBuilding')!
    this.renderer.addClass(activate, 'hide')
    
    var result: boolean;  // Depending on the result, we will return a value

    if (liklihood < comparison){

      this.messageChange.emit({'msg': building.getName() + ' votes to join the revolution!'});

      const wait5s = () => {        
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), 5000);
        })
      }

      await wait5s();

      this.grid[y][x].owner = this.rebel_ownership;
      building.owner = this.rebel_ownership;

      this.updatePopularity(0.125, -0.125);
      
      this.renderer.removeClass(cur_el, 'inProgress');

      this.renderer.removeClass(cur_el, 'neutral');
      this.renderer.removeClass(cur_el, this.govt.position.css);
      this.renderer.addClass(cur_el, this.user.position.css);

      if (this.current_player.player == 'user'){
        result = true;
      } else {
        result = false;
      }

    } else if (liklihood > comparison){

      this.messageChange.emit({'msg': building.getName() + ' sides with the Government forces!'});

      const wait5s = () => {        
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), 5000);
        })
      }
      await wait5s();

      this.grid[y][x].owner = this.govt_ownership;
      building.owner = this.govt_ownership;

      this.updatePopularity(-0.125, 0.125);

      this.renderer.removeClass(cur_el, 'inProgress');

      this.renderer.removeClass(cur_el, 'neutral');
      this.renderer.removeClass(cur_el, this.user.position.css);
      this.renderer.addClass(cur_el, this.govt.position.css);

      if (this.current_player.player == 'user'){
        result = false;
      } else {
        result = true;
      }

    } else {

      this.messageChange.emit({'msg': building.getName() + ' wishes to be neutral for the moment.'})

      const wait5s = () => {        
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), 5000)
        })
      }
      await wait5s()

      this.grid[y][x].owner = this.neutral_ownership;
      building.owner = this.neutral_ownership

      this.updatePopularity(0, -0.15);

      this.renderer.removeClass(cur_el, 'inProgress');

      this.renderer.removeClass(cur_el, this.govt.position.css)
      this.renderer.removeClass(cur_el, this.user.position.css)
      this.renderer.addClass(cur_el, 'neutral');

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
  async activateStreet(street:StreetService): Promise<boolean>{

    console.log ('street to activate:', street)
    var cur_el: HTMLElement = street.element

    this.renderer.addClass(cur_el, 'inProgress');

    var x: number = Number(street.grid['x'])
    var y: number = Number(street.grid['y'])

    // Hide the activate button.
    const activate = cur_el.querySelector('img')
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

      // this.grid[y][x].owner = this.rebel_ownership
      // this.grid[y][x].street.owner = this.rebel_ownership;

      // this.renderer.removeClass(cur_el, 'inProgress');

      // this.renderer.removeClass(cur_el, 'neutral');
      // this.renderer.removeClass(cur_el, this.govt.position.css);
      // this.renderer.addClass(cur_el, this.user.position.css);
      this.changeStreetOwnership(x, y, cur_el, this.rebel_ownership)

      if (this.current_player.player == 'user'){
        result = true;
      } else {
        result = false;
      }

    } else {

      this.messageChange.emit({'msg': 'The street chooses to join the government!', 'random': Math.random()})

      const wait5s = () => {        
        return new Promise<void>(resolve => {
          setTimeout(() => resolve(), 5000)
        })
      }
      await wait5s()

      // this.grid[y][x].owner = this.govt_ownership
      // this.grid[y][x].street.owner = this.govt_ownership;

      // this.renderer.removeClass(cur_el, 'inProgress');
      
      // this.renderer.removeClass(cur_el, 'neutral');
      // this.renderer.removeClass(cur_el, this.user.position.css);
      // this.renderer.addClass(cur_el, this.govt.position.css);
      this.changeStreetOwnership(x, y, cur_el, this.govt_ownership)
      
      if (this.current_player.player == 'user'){
        result = false;
      } else {
        result = true;
      }
    }

    return result
  }

  /**
   * At the end of the computer turn, broadcast the news...
   */
  async broadcastNews(){

    const wait5s = () => {        
      return new Promise<void>(resolve => {
        setTimeout(() => resolve(), 5000);
      })
    }

    this.messageChange.emit({'msg': 'And now here is the news...'});
    await wait5s();

    // pick a number between 1 and 10

    // radio is 1,2,3
    // forces change sides
    // 1 - 20

    // newspaper is 4,5
    // forces change sides
    // 1 - 12

    // airport is 6
    // popularity drops

    // cathedral is 7
    // forces change sides. If neutral, random forces from either side
    // 1 - 10

    // hospital is 8
    // popularity drops

    // xerxes palace is 9
    // forces change sides
    // 1 - 12

    // bank is 10
    // popularity drops

    // if the selected building is NOT the cathedral and it is neutral, then exit this step
    // The cathedral can make a 'neutral' broadcast
    // other buildings report that all remains calm

    var influencers: BuildingService[] = [
      this.getBuildingByName('Radio station'),
      this.getBuildingByName('Radio station'),
      this.getBuildingByName('Radio station'),
      this.getBuildingByName('Newspaper office'),
      this.getBuildingByName('Newspaper office'),
      this.getBuildingByName('Airport'),
      this.getBuildingByName('Cathedral'),
      this.getBuildingByName('Hospital'),
      this.getBuildingByName('Xerxes palace'),
      this.getBuildingByName('Bank')
    ]

    var random_number:number = Math.floor(Math.random() * 10);

    random_number = 1;
    // Select the building:
    var selected_building:BuildingService = influencers[random_number];

    console.log('influencer building:', selected_building)

    const wait2s = () => {        
      return new Promise<void>(resolve => {
        setTimeout(() => resolve(), 5000)
      })
    }

    console.log ('selected building owner:', selected_building.owner)
    if (selected_building.owner != 0) {
      var action: string = selected_building.getAction();
      var consequence: string = selected_building.getConsequence();

      console.log ('action:', action)
      console.log ('consequence:', consequence)

      this.messageChange.emit({'msg': action + '...'})
      await wait5s();

      this.messageChange.emit({'msg': consequence + '...'})
      await wait5s();

      if (selected_building.streetDefection > 0){
        // Randomly select some streets to swap sides
        for (var i = 0; i < selected_building.streetDefection; i ++){
          var y: number = Math.floor(Math.random() * this.grid.length)
          var x: number = Math.floor(Math.random() * this.grid[y].length)

          if (this.grid[y][x].type == 'street' && this.grid[y][x].owner != selected_building.owner){
            var cur_el: HTMLElement = this.grid[y][x].street.element
            this.renderer.addClass(cur_el, 'inProgress');
            await wait2s()
            this.changeStreetOwnership(x, y, cur_el, selected_building.owner)
          }
        }
      } else {
        // This is a popularity change
        if (selected_building.owner == this.rebel_ownership){
          this.updatePopularity(0.2, -0.2)
        } else {
          this.updatePopularity(-0.2, 0.2)
        }
      }
    } else {
      // all remains calm
      if (selected_building.name.toLowerCase() != 'cathedral'){
        var msg: string = 'The ' + selected_building.name + ' reports that all remains calm...';
        
        if (selected_building.name.toLowerCase() == 'xerxes palace'){
          msg = msg.replace('The', '');
        }

        this.messageChange.emit({'msg': msg});
        await wait5s();

      } else {
        var msg: string = 'The Cathedral makes a plea for an end to hostilities...';
        this.messageChange.emit({'msg': msg});

        for (var i = 0; i < selected_building.streetDefection; i ++){
          var y: number = Math.floor(Math.random() * this.grid.length)
          var x: number = Math.floor(Math.random() * this.grid[y].length)

          if (this.grid[y][x].type == 'street' && this.grid[y][x].owner != selected_building.owner){
            var cur_el: HTMLElement = this.grid[y][x].street.element
            this.renderer.addClass(cur_el, 'inProgress');
            await wait2s()
            this.changeStreetOwnership(x, y, cur_el, selected_building.owner)
          }
        }

      }
    }
    //     for (var i = 0; i < 20; i ++){
    //       // Pick a random row and a random column
    //       var y: number = Math.floor(Math.random() * this.grid.length)
    //       var x: number = Math.floor(Math.random() * this.grid[y].length)

    //       if (this.grid[y][x].type == 'street' && this.grid[y][x].owner != this.rebel_ownership){
    //         var cur_el: HTMLElement = this.grid[y][x].street.element
    //         this.renderer.addClass(cur_el, 'inProgress');
    //         await wait2s()
    //         this.changeStreetOwnership(x, y, cur_el, true)
    //       }
    //     }
    //}
    // var msg: string = ''
    // if (selected_building.name.toLowerCase() == 'radio station'){
    //   if (selected_building.owner == this.rebel_ownership){
    //     this.messageChange.emit({'msg': 'The radio station makes a pro-rebel broadcast...'});
    //     await wait5s();
    //     this.messageChange.emit({'msg': 'Some government forces may change sides...'});
    //     await wait5s();
  
    //     // Randomly select some streets
    //     for (var i = 0; i < 20; i ++){
    //       // Pick a random row and a random column
    //       var y: number = Math.floor(Math.random() * this.grid.length)
    //       var x: number = Math.floor(Math.random() * this.grid[y].length)

    //       if (this.grid[y][x].type == 'street' && this.grid[y][x].owner != this.rebel_ownership){
    //         var cur_el: HTMLElement = this.grid[y][x].street.element
    //         this.renderer.addClass(cur_el, 'inProgress');
    //         await wait2s()
    //         this.changeStreetOwnership(x, y, cur_el, true)
    //       }
    //     }
    //   } else if (selected_building.owner == this.govt_ownership){
    //     this.messageChange.emit({'msg': 'The radio station makes a pro-government broadcast...'});
    //     await wait5s();
    //     this.messageChange.emit({'msg': 'Some rebel forces may change sides...'});
    //     await wait5s();

    //     // Randomly select some streets
    //     for (var i = 0; i < 20; i ++){
    //       // Pick a random row and a random column
    //       var y: number = Math.floor(Math.random() * this.grid.length)
    //       var x: number = Math.floor(Math.random() * this.grid[y].length)

    //       if (this.grid[y][x].type == 'street' && this.grid[y][x].owner != this.govt_ownership){
    //         var cur_el: HTMLElement = this.grid[y][x].street.element
    //         this.renderer.addClass(cur_el, 'inProgress');
    //         await wait2s()
    //         this.changeStreetOwnership(x, y, cur_el, false)
    //       }
    //     }
    //   } else {
    //     this.messageChange.emit({'msg': 'The radio station reports that all remains calm'});
    //     await wait5s();
    //   }
    // } else if (selected_building.name.toLowerCase() == 'newspaper office'){
    //   if (selected_building.owner == this.rebel_ownership){
    //     msg = 'The newspaper office releases a pro-rebel newsflash...';
    //   } else if (selected_building.owner == this.govt_ownership){
    //     msg = 'The newspaper office releases a pro-government newsflash...';
    //   } else {
    //     msg = 'The newspaper office reports that all remains calm';
    //   }
    // } else if (selected_building.name.toLowerCase() == 'airport'){
    //   if (selected_building.owner == this.rebel_ownership){
    //     this.messageChange.emit({'msg': 'The airport flies supplies in to the rebels...'});
    //     await wait5s();
    //     this.messageChange.emit({'msg': 'Government popularity falls.'});
    //     await wait5s();
    //     this.updatePopularity(0.2, -0.2)
    //   } else if (selected_building.owner == this.govt_ownership){
    //     this.messageChange.emit({'msg': 'The airport flies supplies in to the government...'});
    //     await wait5s();
    //     this.messageChange.emit({'msg': 'Rebel popularity falls.'});
    //     await wait5s();
    //     this.updatePopularity(-0.2, 0.2)
    //   } else {
    //     this.messageChange.emit({'msg': 'The airport reports that all remains calm'});
    //     await wait5s();
    //   }
    // } else if (selected_building.name.toLowerCase() == 'cathedral'){
    //   if (selected_building.owner == this.rebel_ownership){
    //     msg = 'The cathedral preaches a pro-rebel sermon..';
    //   } else if (selected_building.owner == this.govt_ownership){
    //     msg = 'The cathedral preaches a pro-government sermon...';
    //   } else {
    //     msg = 'The cathedral makes a plea for an end to hostilities...';
    //   }
    // } else if (selected_building.name.toLowerCase() == 'hospital'){
    //   if (selected_building.owner == this.rebel_ownership){
    //     this.messageChange.emit({'msg': 'The hospital gives help to the rebel forces..'});
    //     await wait5s();
    //     this.messageChange.emit({'msg': 'Government popularity falls.'});
    //     await wait5s();
    //     this.updatePopularity(0.2, -0.2)
    //   } else if (selected_building.owner == this.govt_ownership){
    //     this.messageChange.emit({'msg': 'The hospital gives help to the government forces..'});
    //     await wait5s();
    //     this.messageChange.emit({'msg': 'Rebel popularity falls.'});
    //     await wait5s();
    //     this.updatePopularity(-0.2, 0.2)
    //   } else {
    //     this.messageChange.emit({'msg': 'The hospital reports that all remains calm'});
    //     await wait5s();
    //   }
    // } else if (selected_building.name.toLowerCase() == 'xerxes palace'){
    //   if (selected_building.owner == this.rebel_ownership){
    //     msg = 'Xerxes palace receives rebel reinforcements...';
    //   } else if (selected_building.owner == this.govt_ownership){
    //     msg = 'Xerxes palace receives govenment reinforcements...';
    //   } else {
    //     msg = 'Xerxes palace reports that all remains calm...';
    //   }
    // } else if (selected_building.name.toLowerCase() == 'bank'){
    //   if (selected_building.owner == this.rebel_ownership){
    //     this.messageChange.emit({'msg': 'The bank freezes government assets...'});
    //     await wait5s();
    //     this.messageChange.emit({'msg': 'Government popularity falls.'});
    //     await wait5s();
    //     this.updatePopularity(0.2, -0.2)
    //   } else if (selected_building.owner == this.govt_ownership){
    //     this.messageChange.emit({'msg': 'The bank freezes rebel assets...'});
    //     await wait5s();
    //     this.messageChange.emit({'msg': 'Rebel popularity falls.'});
    //     await wait5s();
    //     this.updatePopularity(-0.2, 0.2)
    //   } else {
    //     this.messageChange.emit({'msg': 'The bank reports that all remains calm...'});
    //     await wait5s();
    //   }
    //}

    

    /*
    3000 REM NEWS EVENT
    3002 GOSUB8200
    3005 N$="AND NOW HERE IS THE NEWS................"
    3010 FORJ=1TOLEN(N$):PRINTU0$;MID$(N$,J,1);
    3012 POKEUV,15:POKEUA,9:POKEUD,0:POKEUH,30
    3014 POKEUL,0:POKEUW,129
    3020 POKEUV,0:POKEUA,0:POKEUD,0:POKEUH,0:POKEUL,0:POKEUW,0
    3025 NEXTJ
    3050 K=INT(RND(1)*10+1)							##### pick a number between 1 and 10
    3055 PRINT:GOSUB8200
    3060 ONKGOSUB3090,3090,3090,3092,3092,3094,3096,3097,3098,3099
    3070 FORX=2TO10STEP2:FORY=2TO6STEP2
    3072 IFB5(Y,X)=JTHEN3080
    3074 NEXTY:NEXTX:GOTO3050
    3080 FORL=1TO4:D9$=U1$:GOSUB8110:D9$="":GOSUB8110:NEXTL
    3083 IFM5(Y,X)=0ANDJ<>13THEN3800					##### If this building is neutral, then bail if j=13... WTF?
    3085 M5=0:PRINT""UM$;:IFM5(Y,X)>0THENPRINTUN$;:M5=1
    3086 PRINT"THE "B$(J)"                           "
    3089 ONKGOTO3100,3100,3100,3200,3200,3300,3400,3500,3600,3700
    3090 J=2:RETURN
    3092 J=3:RETURN
    3094 J=9:RETURN
    3096 J=13:RETURN
    3097 J=10:RETURN
    3098 J=7:RETURN
    3099 J=11:RETURN
    3100 REM RADIO STATION
    3110 IFM5=1THEN3130
    3120 PRINT"MAKES A PRO-REBEL BROADCAST"
    3125 GOTO3140
    3130 PRINT"MAKES A PRO-GOVERNMENT BROADCAST"
    3140 GOSUB8050:GOSUB8200
    3150 IFM5=1THEN3170
    3160 FORK=1TO20:GOSUB4200:NEXTK:GOSUB8050:RETURN
    3170 FORK=1TO20:GOSUB4300:NEXTK:GOSUB8050:RETURN
    3200 REM NEWSPAPER OFFICE
    3210 IFM5=1THEN3230
    3220 PRINT"RELEASES A PRO-REBEL NEWSFLASH"
    3225 GOTO3240
    3230 PRINT"RELEASES A PRO-GOVERNMENT NEWSFLASH"
    3240 GOSUB8050:GOSUB8200
    3250 IFM5=1THEN3270
    3260 FORK=1TO12:GOSUB4200:NEXTK:GOSUB8050:RETURN
    3270 FORK=1TO12:GOSUB4300:NEXTK:GOSUB8050:RETURN
    3300 REM AIRPORT
    3310 IFM5=1THEN3330
    3320 PRINT"FLIES SUPPLIES IN TO THE REBELS"
    3325 GOTO3340
    3330 PRINT"FLIES SUPPLIES IN TO THE GOVERNMENT"
    3340 GOSUB8050:GOSUB8200
    3350 IFM5=1THEN3370
    3360 GOSUB4000:GOSUB8050:RETURN
    3370 GOSUB4100:GOSUB8050:RETURN
    3400 REM CATHEDRAL
    3402 IFM5(Y,X)<>0THEN3410
    3405 PRINTUF$"MAKES A PLEA FOR AN END TO HOSTILITIES"
    3408 GOTO3440
    3410 IFM5=1THEN3430
    3420 PRINT"PREACHES A PRO-REBEL SERMON"
    3425 GOTO3440
    3430 PRINT"PREACHES A PRO-GOVERNMENT SERMON"
    3440 GOSUB8050:GOSUB8200
    3450 IFM5(Y,X)=0THENFORK=1TO20:GOSUB4400:NEXTK:GOSUB8050:RETURN
    3455 IFM5=1THEN3470
    3460 FORK=1TO10:GOSUB4200:NEXTK:GOSUB8050:RETURN
    3470 FORK=1TO10:GOSUB4300:NEXTK:GOSUB8050:RETURN
    3500 REM HOSPITAL
    3510 IFM5=1THEN3530
    3520 PRINT"GIVES HELP TO THE REBEL FORCES"
    3525 GOTO3540
    3530 PRINT"GIVES HELP TO THE GOVERNMENT FORCES"
    3540 GOSUB8050:GOSUB8200
    3550 IFM5=1THEN3570
    3560 GOSUB4000:GOSUB8050:RETURN
    3570 GOSUB4100:GOSUB8050:RETURN
    3600 REM XERXES PALACE
    3610 IFM5=1THEN3630
    3620 PRINT"RECEIVES REBEL REINFORCEMENTS"
    3625 GOTO3640
    3630 PRINT"RECEIVES GOVERNMENT REINFORCEMENTS"
    3640 GOSUB8050:GOSUB8200
    3650 IFM5=1THEN3670
    3660 FORK=1TO12:GOSUB4200:NEXTK:GOSUB8050:RETURN
    3670 FORK=1TO12:GOSUB4300:NEXTK:GOSUB8050:RETURN
    3700 REM BANK
    3710 IFM5=1THEN3730
    3720 PRINT"FREEZES GOVERNMENT ASSETS"
    3725 GOTO3740
    3730 PRINT"FREEZES REBEL ASSETS"
    3740 GOSUB8050:GOSUB8200
    3750 IFM5=1THEN3770
    3760 GOSUB4000:GOSUB8050:RETURN
    3770 GOSUB4100:GOSUB8050:RETURN
    3800 REM NO NEWS
    3805 GOSUB8200
    3810 PRINTUF$"";
    3820 PRINT"THE "B$(J)" REPORTS THAT"
    3830 PRINT"ALL REMAINS CALM."
    3840 GOSUB8050
    3850 RETURN
    4000 REM GOVERNMENT POPULARITY DROPS
    4010 PRINTUM$"GOVERNMENT POPULARITY FALLS..........."
    4020 G2=G2-.2:P2=P2+.2:GOSUB8350:RETURN
    4100 REM REBEL POPULARITY DROPS
    4110 PRINTUN$"REBEL POPULARITY FALLS..........."
    4120 P2=P2-.2:G2=G2+.2:GOSUB8350:RETURN
    4200 REM GOVERNMENT FORCES CHANGE SIDES
    4210 PRINTUM$"SOME GOVERNMENT FORCES MAY CHANGE SIDES"
    4220 X=INT(RND(1)*11)+1:Y=INT(RND(1)*7)+1
    4225 IFM5(Y,X)<=0ORB5(Y,X)>0THENRETURN
    4240 D9$=U1$:GOSUB8110:D9$="":GOSUB8110
    4245 M5(Y,X)=-1
    4250 D9$=U1$:GOSUB8110:D9$="":GOSUB8110
    4260 RETURN
    4300 REM REBEL FORCES CHANGE SIDES
    4310 PRINTUN$"SOME REBEL FORCES MAY CHANGE SIDES"
    4320 X=INT(RND(1)*11)+1:Y=INT(RND(1)*7)+1
    4325 IFM5(Y,X)>=0ORB5(Y,X)>0THENRETURN
    4340 D9$=U1$:GOSUB8110:D9$="":GOSUB8110
    4345 M5(Y,X)=1
    4350 D9$=U1$:GOSUB8110:D9$="":GOSUB8110
    4360 RETURN
    4400 REM RANDOM FORCES DESERT
    4410 PRINTUF$"SOME FORCES FROM EITHER SIDE MAY DESERT"
    4420 X=INT(RND(1)*11)+1:Y=INT(RND(1)*7)+1
    4425 IFM5(Y,X)=0ORB5(Y,X)>0THENRETURN
    4440 D9$=U1$:GOSUB8110:D9$="":GOSUB8110
    4445 M5(Y,X)=0
    4450 D9$=U1$:GOSUB8110:D9$="":GOSUB8110
    4460 RETURN
    */
  }

  /**
   * Calculate the mood of the building at the provided grid coordinates.
   * 
   * @param x 
   * @param y 
   * 
   * @returns number
   */
  calculateMood(x: number, y: number): number{				
		
    var square_mood: number = 0
    
    if (y - 1 >= 0){
      square_mood += this.grid[(y-1)][x].owner
      if (x - 1 >= 0){
        square_mood += this.grid[(y - 1)][x - 1].owner
      }

      if (x + 1 < this.grid[(y - 1)].length){
        square_mood += this.grid[(y - 1)][(x + 1)].owner
      }
    }
    if (y + 1 < this.grid.length){
      square_mood += this.grid[y + 1][x].owner
      if (x - 1 >= 0){
        square_mood += this.grid[y + 1][x - 1].owner
      }
      if (x + 1 < this.grid[y + 1].length){
        square_mood += this.grid[y + 1][x + 1].owner
      }
    }

    if ((x-1) >= 0){
      square_mood += this.grid[y][(x-1)].owner
    }

    if (x + 1 < this.grid[y].length){
      square_mood += this.grid[y][x+1].owner
    }

		return square_mood;
	}

  changeStreetOwnership(x: number, y: number, cur_el: HTMLElement, new_ownership: number): boolean{

    this.renderer.removeClass(cur_el, 'inProgress');

    this.renderer.removeClass(cur_el, 'neutral');
    console.log ('new ownership for this street:', new_ownership)
    if (new_ownership == this.rebel_ownership) {
      this.grid[y][x].owner = this.rebel_ownership
      this.grid[y][x].street.owner = this.rebel_ownership;
      this.renderer.removeClass(cur_el, this.govt.position.css);
      this.renderer.addClass(cur_el, this.user.position.css);
    } else if (new_ownership == this.govt_ownership) {
      this.grid[y][x].owner = this.govt_ownership
      this.grid[y][x].street.owner = this.govt_ownership;
      this.renderer.removeClass(cur_el, this.user.position.css);
      this.renderer.addClass(cur_el, this.govt.position.css);
    } else {
      this.grid[y][x].owner = this.neutral_ownership;
      this.grid[y][x].street.owner = this.neutral_ownership;
      this.renderer.removeClass(cur_el, this.user.position.css);
      this.renderer.removeClass(cur_el, this.govt.position.css);
      this.renderer.addClass(cur_el, 'neutral');
    }

    return true
  }

  async computerTurn(){

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

      // for i = 1 to 4:
      // # randomly pick a building
      // if b>=(5-q/2) then activate the building
      // otherwise activate a square
      //   randomly pick a square that the government doesn't already own
      
    const wait5s = () => {        
      return new Promise<void>(resolve => {
        setTimeout(() => resolve(), 5000);
      })
    }
    
    console.log ('STARTING COMPUTER TURN')

    // Set up the remaining moves and assign the correct current_player
    this.remaining_moves = this.max_moves;
    this.current_player = this.govt;
    this.updateRemainingMoves()

    var activation_result:boolean = false;

    console.log ('current player:', this.current_player)

    var cont: boolean = true;

    // The computer has 4 moves, unless one of them fails
    for (var i = 0; i < this.max_moves; i++){
      console.log ('turn #', i)
      
      // First, we'll try and find a building to take
      var random_buildings: BuildingService[] = this.randomBuildings() 
      var selected_building:BuildingService
      for (var j = 0; j < random_buildings.length; j++){
        // Select a random building and check if it's not owned by the government
        selected_building = random_buildings[j]
        if (selected_building.owner != this.govt_ownership){
          
          // Check to see if this was successful
          var square_mood: number = this.calculateMood(Number(selected_building.grid['x']), Number(selected_building.grid['y']))
          var liklihood: number  = selected_building.calculateLiklihood(this.user.popularity, this.govt.popularity, square_mood)
          if (liklihood >= (5 - Math.floor(((i + 1) / 2)))){

            this.messageChange.emit({'msg': 'The government tries to take ' + selected_building.getName() + '...'});
            await wait5s();
            
            activation_result = await this.activateBuilding(selected_building)
            
            // Update the remaining moves
            this.userSelectionFollowup(activation_result);

            // If this failed, then it's back to the user
            if (activation_result == false || this.remaining_moves == 0){
              cont = false;
              break;
            }
          }
        }
      }

      // Now that we've checked the buildings, try and take some streets
      if (cont == true){
        var random_streets: StreetService[] = this.randomStreets()
        var selected_street:StreetService
        for (var k = 0; k < random_streets.length; k++){
          selected_street = random_streets[k];
          if (selected_street.owner != this.govt_ownership){
            var squareMood: number = this.calculateMood(Number(selected_street.grid['x']), Number(selected_street.grid['y']))

            if (squareMood > 0){
              this.messageChange.emit({'msg': 'The government tries to take a street...'});
              await wait5s();

              activation_result = await this.activateStreet(selected_street)
              this.userSelectionFollowup(activation_result);

              if (activation_result == false || this.remaining_moves == 0){
                cont = false;
                break;
              }

            }
          }
        }
      }

      if (cont == false){
        console.log ('END OF COMPUTER TURN')
        
        break;
      }

    }

    // Now run the news
    console.log ('Broadcast some news')
    await this.broadcastNews()

    console.log ('USER TURN NOW')
    this.messageChange.emit({'msg': 'Your turn - continue the revolution!'});

    // Set up the remaining moves and assign the correct current_player
    this.remaining_moves = this.max_moves;
    this.current_player = this.user;
    this.updateRemainingMoves()
  }

  /**
   * Return a building based on the name.
   * 
   * @param buildingName 
   * @returns BuildingService
   */
  getBuildingByName(buildingName: string):BuildingService {

    var result: BuildingService;

    for (var i = 0; i < this.buildings.buildings.length; i++){
      if (this.buildings.buildings[i].name.toLowerCase() == buildingName.toLowerCase()){
        result = this.buildings.buildings[i];
        break;
      }
    }

    return result!;
  }
  /**
   * Returns a randomised list of buildings
   * 
   * @returns BuildingService[]
   */
  randomBuildings(): BuildingService[] {

    var nums: number[] = [];

    for (var i = 0; i < this.buildings.buildings.length; i ++){
      nums.push(i);
    }
    
    var random_buildings: BuildingService[] = [];
    var i: number = nums.length;
    var j: number = 0;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        random_buildings.push(this.buildings.buildings[nums[j]])
        nums.splice(j, 1);
    }

    return random_buildings;
  }
  
  /**
   * Returns an array of numbers betwen 0 and 14, randomised.
   * This is so we can pick random buildings.
   * 
   * @returns number[]
   */
  randomNumbers():number[]{
    
    var nums: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    
    var random_numbers: number[] = [];
    var i: number = nums.length;
    var j: number = 0;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        random_numbers.push(nums[j]);
        nums.splice(j, 1);
    }

    return random_numbers
  }

  /**
   * Returns a randomised list of streets
   * 
   * @returns StreetService[]
   */
  randomStreets(): StreetService[] {

    var nums: number[] = [];

    for (var i = 0; i < this.streets.length; i ++){
      nums.push(i);
    }
    
    var random_streets: StreetService[] = [];
    var i: number = nums.length;
    var j: number = 0;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        random_streets.push(this.streets[nums[j]])
        nums.splice(j, 1);
    }

    return random_streets;
  }

  /**
   * Update the popularity with the changes for each player.
   * Then send the results to the parent component.
   * 
   * @param userChange 
   * @param govtChange 
   * 
   * @returns void
   */
  updatePopularity(userChange: number, govtChange: number): void {
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

  /**
   * Send a message to the parent component with the remaining moves for the current player.
   * 
   * @returns void
   */
  updateRemainingMoves(): void {
    this.movesChange.emit({'remaining_moves': this.remaining_moves, 'current_player': this.current_player});
  }

  /**
   * Calculate the scores for both players, and send it to the parent component.
   * It's not great, but we'll cycle through all the buildings and calculate the correct scores for both players
   * 
   * @returns void
   */
  updateScore(): void {

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

  /**
   * The user has clicked on a building.
   * We need to find the HTML element that holds this building,
   * and then run the activation process.
   * At the end, update the remaining moves and score
   * 
   * @param $event
   * 
   * @returns Promise<void>
   */
  async userBuildingSelect($event:Event): Promise<void>{

    //this.broadcastNews()

    var cur_el: any = $event.target;

    while (!cur_el.getAttribute('data-building-name'))
      cur_el = cur_el.parentElement
    
    var building:BuildingService = this.grid[Number(cur_el.getAttribute('data-row'))][Number(cur_el.getAttribute('data-col'))]['building']

    var activation_result: boolean = await this.activateBuilding(building)
    
    this.userSelectionFollowup(activation_result)
    
    // If the activation result was false, then switch users and reset the move count
    // Also, if the score is now 0, then it's the government's turn
    if (activation_result == false || this.remaining_moves == 0){
      this.computerTurn()
    }

  }

  /**
   * After the street or building has been activated, do some standard recalculations.
   * 
   * @param activation_result boolean
   * 
   * @returns void
   */
  userSelectionFollowup(activation_result: boolean): void{
    //Go through each building and update the liklihood
    for (var index=0; index < this.buildings.buildings.length; index++){
      let building:BuildingService = this.buildings.buildings[index]
      var square_mood = this.calculateMood(building.grid['x'],building.grid['y']);
      building.calculateLiklihood(this.user.popularity, this.govt.popularity, square_mood)
    }

    // Update the remaining moves and score
    this.remaining_moves -= 1;
    this.updateRemainingMoves()
    this.updateScore()
  }

  /**
   * The user has clicked on a street.
   * We need to find the HTML element that holds this street,
   * and then run the activation process.
   * At the end, update the remaining moves and score
   * 
   * @param $event
   * 
   * @returns Promise<void>
   */
  async userStreetSelect($event: Event): Promise<void>{

    var cur_el: any = $event.target;

    while (!cur_el.getAttribute('data-col'))
      cur_el = cur_el.parentElement
    
    var street:StreetService = this.grid[Number(cur_el.getAttribute('data-row'))][Number(cur_el.getAttribute('data-col'))]['street']

    var activation_result: boolean = await this.activateStreet(street)

    this.userSelectionFollowup(activation_result)

    // If the activation result was false, then switch users and reset the move count
    // Also, if the score is now 0, then it's the government's turn
    if (activation_result == false || this.remaining_moves == 0){
      this.computerTurn()
    }
  }

  /**
   * Set up the map with random buildings and the associated hooks
   */
  ngAfterViewInit() {

    var building_divs = this.el.nativeElement.querySelectorAll('div.building');

    var random_numbers: number[] = this.randomNumbers()
    var count: number = 0
    building_divs.forEach((building_div: any) => {
      let random_building = this.buildings.buildings[random_numbers[count]]

      var div_building_background = this.renderer.createElement('div')
      this.renderer.addClass(div_building_background, 'building-background')

      var div_building_image = this.renderer.createElement('div')
      var building_img = this.renderer.createElement('img')
      this.renderer.setAttribute(building_img, 'src', '/assets/buildings/' + random_building.image)
      this.renderer.setAttribute(building_img, 'width', '100')
      this.renderer.addClass(div_building_image, 'building-image')
      this.renderer.appendChild(div_building_image, building_img)
      this.renderer.appendChild(div_building_background, div_building_image)

      var div_building_name = this.renderer.createElement('div')
      this.renderer.addClass(div_building_name, 'building-name')

      var building_name = this.renderer.createElement('p')
      var building_text = this.renderer.createText(random_building.name)
      this.renderer.appendChild(building_name, building_text)
      this.renderer.appendChild(div_building_name, building_name)
      this.renderer.appendChild(div_building_background, div_building_name)

      var div_building_points = this.renderer.createElement('div')
      this.renderer.addClass(div_building_points, 'building-points')

      var building_points = this.renderer.createElement('p')
      var points_text = this.renderer.createText(String(random_building.points))

      this.renderer.appendChild(building_points, points_text)
      this.renderer.appendChild(div_building_points, building_points)
      this.renderer.appendChild(div_building_background, div_building_points)

      var intelligence = this.renderer.createElement('p')
      var intelligence_text = this.renderer.createText('')
      this.renderer.addClass(intelligence, 'buildingIntelligence')
      this.renderer.appendChild(intelligence, intelligence_text)
      this.renderer.appendChild(div_building_background, intelligence)

      var activate = this.renderer.createElement('p')
      var activate_img = this.renderer.createElement('img')
      this.renderer.setAttribute(activate_img, 'src', '/assets/activate_symbol.png');
      this.renderer.setAttribute(activate_img, 'width', '25');
      this.renderer.setAttribute(activate_img, 'height', '25');
      this.renderer.addClass(activate, 'activateBuilding')
      this.renderer.appendChild(activate, activate_img)
      this.renderer.appendChild(div_building_background, activate)

      this.renderer.appendChild(building_div, div_building_background)
      
      this.renderer.setAttribute(building_div, 'data-building-name', random_building.name)

      building_div.addEventListener('mouseenter', this.onMouseOverBuilding.bind(this));
      activate.addEventListener('click', this.userBuildingSelect.bind(this));

     count += 1;

    })

    // Set up the grid object. This is what we use to calculate moves and ownerships
    count = 0;
    for(var y=0; y<7; y++){
			this.grid[y] = new Array();
			for(var x = 0; x < 11; x ++){
			  this.grid[y][x] = new Array();
        this.grid[y][x].owner = this.neutral_ownership;
        if (y % 2 == 1 && x % 2 == 1){
					this.grid[y][x]['type'] = 'building';
          this.grid[y][x]['building'] = this.buildings.buildings[random_numbers[count]]
          this.buildings.buildings[random_numbers[count]].setGridCoords(x, y)
          count += 1;
        } else
					this.grid[y][x]['type'] = 'street';
			}
		}
    
    var street_divs = this.el.nativeElement.querySelectorAll('div.street');

    street_divs.forEach((street_div: any) => {
      street_div.addEventListener('mouseenter', this.onMouseOverStreet.bind(this));

      var x: number = street_div.getAttribute('data-col');
      var y: number = street_div.getAttribute('data-row');

      var street:StreetService = new StreetService(x, y, street_div);
      this.streets.push(street);
      this.grid[y][x]['street'] = street;

      console.log (street.element)
    })

    var street_divs_imgs = this.el.nativeElement.querySelectorAll('div.street img');
    street_divs_imgs.forEach((street_img: any) => {
      street_img.addEventListener('click', this.userStreetSelect.bind(this));
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

    if (this.grid[y][x].owner == this.rebel_ownership) {
      this.renderer.addClass(activate, 'hide')
      target.innerHTML = 'The ' + building.name + ' has already joined the revolution.'
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

    if (this.grid[y][x].owner == this.rebel_ownership) {
      this.renderer.addClass(activate, 'hide')
    } else {
      this.renderer.removeClass(activate, 'hide')
    }
  }

  constructor(public buildings: BuildingsService, private el: ElementRef, private renderer: Renderer2) {}
}
