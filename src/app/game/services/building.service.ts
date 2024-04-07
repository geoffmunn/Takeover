import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  public name: string = ''
  public leaning: number = 0
  public proGovernment: number = 0
  public points: number = 0

  constructor(name:string, leaning:number, proGovernment: number, points: number) {
    this.name = name;
    this.leaning = leaning;
    this.proGovernment = proGovernment;
    this.points = points
  }
}
