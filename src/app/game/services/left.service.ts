import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeftService {

  colour:string = '#ff0000'
  colourName:string = 'red'
  description:string = 'left'
  
  constructor() { }

  // getLeft(){
  //   return {
  //     'colour': this.colour,
  //     'description': this.description,
  //   }
  // }
}
