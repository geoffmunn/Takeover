import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PlayerService {

  politicalType: string = '';
  position: any
  colour: string = ''
  colourName: string = ''
  stability: string = ''
  
  constructor() {}
}
