import { Injectable } from '@angular/core';
import { PoliticalTypeService } from './political-type.service';

@Injectable({
  providedIn: 'root'
})

export class PlayerService {

  politicalType: string = '';
  position: any
  positionx: string = ''
  colour: string = ''
  colourName: string = ''
  stability: string = ''
  
  constructor() {}
  // constructor(politicalType: PoliticalTypeService) { 
  //   this.position = politicalType

  // }
}
