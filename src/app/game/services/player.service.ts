import { Injectable } from '@angular/core';
import { GovtTypesService } from './govt-types.service';

// @Injectable({
//   providedIn: 'root'
// })

export class PlayerService {

  politicalType: number = 0;
  position: any
  colour: string = ''
  colourName: string = ''
  //stability: string = ''
  stability: number = 0
  popularity: number = 0

  constructor() {}

  getPoliticalType(){

    var result: string = ''
    var govtTypes = new GovtTypesService().govtTypes

    govtTypes.forEach((value: number, key: string) => {
      if (value == this.politicalType)
        result = key
    });

    return result
  }
}
