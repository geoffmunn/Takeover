import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StreetService {

  public grid: any            = {};   // A json object of the grid coordinates
  public image: string         = '';  // Static - doesn't change
  //public leaning: number       = 0;   // Only used at the starting summary
  //public liklihood: number     = 0;   // This is set at the beginning and is the reference for all takeover attempts
  public mood: string          = '';  // A string representation of floating liklihood value
  //public name: string          = '';  // Static - doesn't change
  public owner: number         = 0    // Changes depending on the game progress
  //public points: number        = 0;   // Static - doesn't change
  //public proGovernment: number = 0;   // Only used at the starting summary

  constructor(@Inject(Number) x: number, @Inject(Number) y: number) {
    this.grid          = {'x': x, 'y': y}
    this.image         = 'road' + y + '_' + x + '.png';
    //this.leaning       = leaning;
    //this.name          = name;
    this.owner         = 0
    //this.points        = points
    //this.proGovernment = proGovernment;
  }
}
