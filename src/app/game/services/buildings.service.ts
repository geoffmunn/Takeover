import { Injectable } from '@angular/core';
import { BuildingService } from './building.service';
@Injectable({
  providedIn: 'root'
})
export class BuildingsService {
  
  buildings: any[] = []

  constructor() {
    this.buildings = [
      new BuildingService('Government building', 3, 2, 3).getDetails(),
      new BuildingService('Radio station', 3, 0, 3).getDetails(),
      new BuildingService('Newspaper office', 3, 0, 2).getDetails(),
      new BuildingService('Police station', 4, 2, 5).getDetails(),
      new BuildingService('Military HQ', 5, 1, 8).getDetails(),
      new BuildingService('Trades Union', 1, 0, 5).getDetails(),
      new BuildingService('Xerxes Palace', 3, 6, 9).getDetails(),
      new BuildingService('University', 1,-2, 4).getDetails(),
      new BuildingService('Airport', 4, 1, 3).getDetails(),
      new BuildingService('Hospital', 3, 0, 2).getDetails(),
      new BuildingService('Bank', 3, 3, 1).getDetails(),
      new BuildingService('Shopping centre', 4, 2, 1).getDetails(),
      new BuildingService('Cathedral', 3, -1, 2).getDetails(),
      new BuildingService('Factory', 2, 1, 3).getDetails(),
      new BuildingService('Jail', 3, -2, 1).getDetails()
    ]
  }
}
