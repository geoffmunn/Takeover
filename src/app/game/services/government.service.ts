import { Injectable } from '@angular/core';
import { PoliticalTypeService } from './political-type.service';

@Injectable({
  providedIn: 'root'
})

export class GovernmentService {

  politicalType: string = '';
  position2: PoliticalTypeService
  position: string = ''
  colour: string = ''
  colourName: string = ''

  constructor(politicalType: PoliticalTypeService) { 
    this.position2 = politicalType
  }
}