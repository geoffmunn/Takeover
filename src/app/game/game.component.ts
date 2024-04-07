import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { PoliticalSelection } from './political-selector/political-selector.component';
import { StabilitySelection } from './stability-selector/stability-selector.component';
//import { LeftService } from './services/left.service';
//import { RightService } from './services/right.service';
import { PlayerService } from './services/player.service';
import { LeftService } from './services/left.service';
import { RightService } from './services/right.service';
//import { GovernmentService } from './services/government.service';
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgIf, PoliticalSelection, StabilitySelection],
  templateUrl: './game.component.html', 
  styleUrl: './game.component.css',
  providers: [PlayerService]
})

export class GameComponent {

  //public userPoliticalSelection:string = ''
  //public govtPoliticalSelection:string = ''
  //public govtStabilitySelection:string = ''

  public user: PlayerService | undefined;
  public govt: PlayerService | undefined
  //public player3: PlayerService | undefined

  public showHide = {
    'intro': true,
    'howToPlay': false,
    'theMap': false,
    'scenarios': false,
    'pickASide': false,
    'confirmation': false
  }

  //govtTypes: string[] = ['Communist', 'Socialist', 'Liberal', 'Rightwing', 'Fascist'];

  getGovtTypes() {
    let map = new Map<string, number>();

    map.set('Communist', 1); 
    map.set('Socialist', 2);
    map.set('Liberal', 3);
    map.set('Rightwing', 4);
    map.set('Fascist', 5);

    return map
  }
  
  checkPoliticalSelections(){
    let govtTypes = this.getGovtTypes()

    if (this.govt!.politicalType != ''){
      let userType: number | undefined = govtTypes.get(this.user!.politicalType)
      let govtType: number | undefined = govtTypes.get(this.govt!.politicalType)

      //console.log ('userType:', userType)
      
      //player3!.test = 'geoff3'

      

      if (userType! <= govtType!){
        //console.log ('assigning left')
        let userPositionType = new LeftService()
        let govtPositionType = new RightService()

        //console.log(userPositionType.getLeft())

        //userPositionType.description = 'hi'

        this.user!.position = userPositionType
        this.govt!.position = govtPositionType

        //console.log (this.user!.position.description)
        
          //this.user.position2.chosenType = this.user.position2.leftType
          //this.govt.position2.chosenType = this.govt.position2.rightType
          // this.user!.colour = '#ff0000'
          // this.user!.position = 'left'
          // this.user!.colourName = 'red'

          // this.govt.colour = '#0000ff'
          // this.govt.position = 'right'
          // this.govt.colourName = 'blue'

      } else {

        let userPositionType = new RightService()
        let govtPositionType = new LeftService()

        this.user!.position = userPositionType
        this.govt!.position = govtPositionType
        //this.user.position2.chosenType = this.user.position2.rightType
        //this.govt.position2.chosenType = this.govt.position2.leftType
        // this.govt.colour = '#ff0000'
        // this.govt.position = 'left'
        // this.govt.colourName = 'red'

        // this.user.colour = '#0000ff'
        // this.user.position = 'right'
        // this.user.colourName = 'blue'
      }

      //console.log('player 3 test:', player3.test)
    }

    // if (this.user!.politicalType != '')
    //   console.log (this.user!.position.description)
    // //   console.log (this.user.position2.chosenType)
    // //   console.log (this.govt.position2.chosenType)

    // if (this.govt!.politicalType != '')
    //   console.log (this.govt!.position.description)
    // //   console.log (this.user.position2.chosenType)
    // //   console.log (this.govt.position2.chosenType)
    
  }
  registerUserPoliticalSelection(event:string) {
    this.user!.politicalType = event
    
    this.checkPoliticalSelections()
  }
  registerGovtPoliticalSelection(event:string) {
    this.govt!.politicalType = event

    this.checkPoliticalSelections()
  }
  registerGovtStabilitySelection(event:string) {
    this.govt!.stability = event
  }

  nextPage(nextDiv:string){
    for (let key in this.showHide) {
      //let value = this.showHide[key as keyof typeof this.showHide]
      
      if (key == nextDiv) {
        this.showHide[key as keyof typeof this.showHide] = true
      } else {
        this.showHide[key as keyof typeof this.showHide] = false
      }
    }
  }

  constructor() {
   // let userPoliticalSelection: any = new PoliticalSelection()
    //let govtPoliticalSelection: any = new PoliticalSelection()
      
    //this.user = new PlayerService(userPoliticalSelection)
    //this.govt = new PlayerService(govtPoliticalSelection)
    this.user = new PlayerService()
    this.govt = new PlayerService()
  }
  // constructor(player: PlayerService, govt: GovernmentService, player2: PlayerService){

  //   player.test = 'Geoff1';
  //   player2.test = 'Geoff2';
  //   //this.player3!.test = 'Geoff3'

  //   this.user = player
  //   this.govt = govt
    
  //   console.log('player test:', player.test)
  //   console.log('player2 test:', player2.test)
  //   //console.log('player3 test:', this.player3!.test)
  // }
}

