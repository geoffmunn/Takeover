//import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
export class GovtTypesService {

  govtTypes: Map<string, number>
    
  constructor() {
    this.govtTypes = new Map<string, number>();

    this.govtTypes.set('Communist', 1); 
    this.govtTypes.set('Socialist', 2);
    this.govtTypes.set('Liberal', 3);
    this.govtTypes.set('Rightwing', 4);
    this.govtTypes.set('Fascist', 5);
  }
}
