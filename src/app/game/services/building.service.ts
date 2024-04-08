import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  public name: string = ''
  public leaning: number = 0
  public proGovernment: number = 0
  public points: number = 0

  constructor(@Inject(String) name:string, @Inject(Number) leaning:number, @Inject(Number) proGovernment: number, @Inject(Number) points: number) {
    this.name = name;
    this.leaning = leaning;
    this.proGovernment = proGovernment;
    this.points = points
  }

  getDetails(){
    return {
      'name': this.name,
      'leaning': this.leaning,
      'proGovernment': this.proGovernment,
      'points': this.points
    }
  }
}
