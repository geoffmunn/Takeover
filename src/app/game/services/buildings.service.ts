import { Injectable } from '@angular/core';
import { BuildingService } from './building.service';
@Injectable({
  providedIn: 'root'
})
export class BuildingsService {
  
  buildings = new Map<string, BuildingService>();

  constructor() {
    this.buildings.set('Government building', new BuildingService('Government building', 3, 2, 3))
    this.buildings.set('Radio station', new BuildingService('Radio station', 3, 0, 3))
    this.buildings.set('Newspaper office', new BuildingService('Newspaper office', 3, 0, 2))
    this.buildings.set('Police station', new BuildingService('Police station', 4, 2, 5))
    this.buildings.set('Military HQ', new BuildingService('Military HQ', 5, 1, 8))
    this.buildings.set('Trades Union', new BuildingService('Trades Union', 1, 0, 5))
    this.buildings.set('Xerxes Palace', new BuildingService('Xerxes Palace', 3, 6, 9))
    this.buildings.set('University', new BuildingService('University', 1,-2, 4))
    this.buildings.set('Airport', new BuildingService('Airport', 4, 1, 3))
    this.buildings.set('Hospital', new BuildingService('Hospital', 3, 0, 2))
    this.buildings.set('Bank', new BuildingService('Bank', 3, 3, 1))
    this.buildings.set('Shopping centre', new BuildingService('Shopping centre', 4, 2, 1))
    this.buildings.set('Cathederal', new BuildingService('Cathedral', 3, -1, 2))
    this.buildings.set('Factory', new BuildingService('Factory', 2, 1, 3))
    this.buildings.set('Jail', new BuildingService('Jail', 3, -2, 1))
  }
}
