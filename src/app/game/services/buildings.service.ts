import { Injectable } from '@angular/core';
import { BuildingService } from './building.service';
@Injectable({
  providedIn: 'root'
})

export class BuildingsService {
  
  buildings: any[] = []

  constructor() {
    this.buildings = [
      new BuildingService('Government building', 3, 2, 3, 0),
      new BuildingService('Radio station', 3, 0, 3, 20, 'The radio station makes a pro-[x] broadcast'),
      new BuildingService('Newspaper office', 3, 0, 2, 12, 'The newspaper office releases a pro-[x] newsflash'),
      new BuildingService('Police station', 4, 2, 5, 0),
      new BuildingService('Military HQ', 5, 1, 8, 0),
      new BuildingService('Trades union', 1, 0, 5, 0),
      new BuildingService('Xerxes palace', 3, 6, 9, 12, 'Xerxes palace receives [x] reinforcements'),
      new BuildingService('University', 1,-2, 4, 0),
      new BuildingService('Airport', 4, 1, 3, 0, 'The airport flies supplies in to the [x]', ),
      new BuildingService('Hospital', 3, 0, 2, 0, 'The hospital gives help to the [x] forces'),
      new BuildingService('Bank', 3, 3, 1, 0, 'The bank freezes [x] assets'),
      new BuildingService('Shopping centre', 4, 2, 1, 0),
      new BuildingService('Cathedral', 3, -1, 2, 10, 'The cathedral preaches a pro-[x] sermon'),
      new BuildingService('Factory', 2, 1, 3, 0),
      new BuildingService('Jail', 3, -2, 1, 0)
    ]
  }

  initialiseLiklihoods(userPopularity: number, userType: number, govtPopularity: number, govtType: number){
    /*
    A bulk initialiser for the buildings liklihood and mood descriptions
    */

    for (let key in this.buildings){
      let building: BuildingService = this.buildings[key]

      let score = 3 - Math.abs(building.leaning - govtType) + Math.abs(building.leaning - userType) + building.proGovernment
      let liklihood = Math.floor(score + govtPopularity - userPopularity)

      if (liklihood < 1)
        liklihood = 1
      if (liklihood > 5)
        liklihood = 5
      
      // NOTE: this is the ONLY place that this value will be set
      building.liklihood = liklihood
      building.mood = building.getMoodFromLiklihood(liklihood)
    }
  }

}
