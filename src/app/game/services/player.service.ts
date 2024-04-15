import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PlayerService {

  //politicalType: string = '';
  politicalType: number = 0;
  position: any
  colour: string = ''
  colourName: string = ''
  //stability: string = ''
  stability: number = 0
  popularity: number = 0

  constructor() {}

  // updatePopularity(){
  //   govt_popularity=(difficulty-1)/2+1.5+Math.abs(3-govt_type)/2;
	// 	rebel_popularity=2.5+Math.abs(3-rebel_type)/2;
  // }
}
