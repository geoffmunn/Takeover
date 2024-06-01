import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StreetService {

  public element!: HTMLElement
  public grid: any             = {};   // A json object of the grid coordinates
  public image: string         = '';  // Static - doesn't change
  public mood: string          = '';  // A string representation of floating liklihood value
  public owner: number         = 0    // Changes depending on the game progress
  
  constructor(@Inject(Number) x: number, @Inject(Number) y: number, element: HTMLElement) {
    this.element = element
    this.grid    = {'x': x, 'y': y}
    this.image   = 'road' + y + '_' + x + '.png';
    this.owner   = 0
  }
}
