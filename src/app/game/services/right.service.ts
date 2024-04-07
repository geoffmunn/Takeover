import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RightService {

  colour:string = '#0000ff'
  colourName:string = 'blue'
  description:string = 'right'

  constructor() { }

  // getRight(){
  //   return {
  //     'colour': this.colour,
  //     'description': this.description,
  //   }
  // }
}
