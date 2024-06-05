import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StabilitlyTypesService {

  stabilityTypes: Map<string, number>
    
  constructor() {
    this.stabilityTypes = new Map<string, number>();

    this.stabilityTypes.set('Very weak & about to fall', 1); 
    this.stabilityTypes.set('Weak & unpopular', 2);
    this.stabilityTypes.set('Reasonably secure', 3);
    this.stabilityTypes.set('Stable & strong', 4);
    this.stabilityTypes.set('Very secure & highly popular', 5);
  }
}
