import { Injectable } from '@angular/core';
import { GovtTypesService } from './govt-types.service';

export class PlayerService {

  player: string        = ''
  politicalType: number = 0;
  popularity: number    = 0
  position: any
  score: number         = 0
  stability: number     = 0
  
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
