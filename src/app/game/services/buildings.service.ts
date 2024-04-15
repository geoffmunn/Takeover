import { Injectable } from '@angular/core';
import { BuildingService } from './building.service';
@Injectable({
  providedIn: 'root'
})
export class BuildingsService {
  
  buildings: any[] = []

  constructor() {
    this.buildings = [
      new BuildingService('Government building', 3, 2, 3),
      new BuildingService('Radio station', 3, 0, 3),
      new BuildingService('Newspaper office', 3, 0, 2),
      new BuildingService('Police station', 4, 2, 5),
      new BuildingService('Military HQ', 5, 1, 8),
      new BuildingService('Trades Union', 1, 0, 5),
      new BuildingService('Xerxes Palace', 3, 6, 9),
      new BuildingService('University', 1,-2, 4),
      new BuildingService('Airport', 4, 1, 3),
      new BuildingService('Hospital', 3, 0, 2),
      new BuildingService('Bank', 3, 3, 1),
      new BuildingService('Shopping centre', 4, 2, 1),
      new BuildingService('Cathedral', 3, -1, 2),
      new BuildingService('Factory', 2, 1, 3),
      new BuildingService('Jail', 3, -2, 1)
    ]
  }

  calculateLiklihoods(govtPopularity: number, govtType: number, userPopularity: number, userType: number){

    for (let key in this.buildings){
      let building: BuildingService = this.buildings[key]

      let score = 3 - Math.abs(building.leaning - govtType) + Math.abs(building.leaning - userType) + building.proGovernment
      let liklihood = Math.floor(score + govtPopularity - userPopularity)

      if (liklihood > 5)
        liklihood = 5
      if (liklihood < 1)
        liklihood = 1

      this.buildings[key].liklihood = liklihood

      var moods=Array();
      moods[1]='will';
      moods[2]='probably will';
      moods[3]='might';
      moods[4]="probably won't";
      moods[5]='will not';

      this.buildings[key].mood = moods[liklihood]
    }
  }
}
