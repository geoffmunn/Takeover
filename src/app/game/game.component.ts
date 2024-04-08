import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { PoliticalSelection } from './political-selector/political-selector.component';
import { StabilitySelection } from './stability-selector/stability-selector.component';
import { PlayerService } from './services/player.service';
import { LeftService } from './services/left.service';
import { RightService } from './services/right.service';
import { BuildingsService } from './services/buildings.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgIf, NgFor, PoliticalSelection, StabilitySelection],
  templateUrl: './game.component.html', 
  styleUrl: './game.component.css',
  providers: [PlayerService]
})

export class GameComponent {

  public user: PlayerService | undefined;
  public govt: PlayerService | undefined;
  public buildings: any

  public showHide = {
    'intro': true,
    'howToPlay': false,
    'theMap': false,
    'scenarios': false,
    'pickASide': false,
    'confirmation': false,
    'summary': false
  };

  getGovtTypes() {
    let map = new Map<string, number>();

    map.set('Communist', 1); 
    map.set('Socialist', 2);
    map.set('Liberal', 3);
    map.set('Rightwing', 4);
    map.set('Fascist', 5);

    return map;
  };
  
  checkPoliticalSelections(){

    let govtTypes = this.getGovtTypes();
    let left = new LeftService();
    let right = new RightService();

    if (this.govt!.politicalType != ''){
      let userType: number | undefined = govtTypes.get(this.user!.politicalType);
      let govtType: number | undefined = govtTypes.get(this.govt!.politicalType);

      if (userType! <= govtType!){
        this.user!.position = left;
        this.govt!.position = right;
      } else {
        this.user!.position = right;
        this.govt!.position = left;
      };
    };
  };

  registerUserPoliticalSelection(event:string) {
    this.user!.politicalType = event;
    this.checkPoliticalSelections();
  };
  registerGovtPoliticalSelection(event:string) {
    this.govt!.politicalType = event;
    this.checkPoliticalSelections();
  };
  registerGovtStabilitySelection(event:string) {
    this.govt!.stability = event;
  };

  nextPage(nextDiv:string){
    for (let key in this.showHide) {
      //let value = this.showHide[key as keyof typeof this.showHide]
      
      if (key == nextDiv) {
        this.showHide[key as keyof typeof this.showHide] = true;
      } else {
        this.showHide[key as keyof typeof this.showHide] = false;
      }
    }
  };

  constructor() {
    this.user = new PlayerService();
    this.govt = new PlayerService();
    this.buildings = new BuildingsService().buildings
  };
}

