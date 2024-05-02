import { Inject } from '@angular/core';
import { GovtTypesService } from './govt-types.service';
import { LowerCasePipe } from '@angular/common';

export class BuildingService {

  public image: string         = '';  // Static - doesn't change
  public leaning: number       = 0;   // Only used at the starting summary
  public liklihood: number     = 0;   // Constantly changing depending on game progress
  public mood: string          = '';  // A string representation of the liklihood value
  public name: string          = '';  // Static - doesn't change
  public points: number        = 0;   // Static - doesn't change
  public proGovernment: number = 0;   // Only used at the starting summary

  constructor(@Inject(String) name:string, @Inject(Number) leaning:number, @Inject(Number) proGovernment: number, @Inject(Number) points: number) {
    /*
    Create a building object with the basic details
    */
    this.image         = name.toLowerCase().replace(' ', '_') + '.png'
    this.leaning       = leaning;
    this.name          = name;
    this.points        = points
    this.proGovernment = proGovernment;
    
  }

  calculateLiklihood(userPopularity: number, userType: number, govtPopularity: number, govtType: number){

    let score = 3 - Math.abs(this.leaning - govtType) + Math.abs(this.leaning - userType) + this.proGovernment
    let liklihood = Math.floor(score + govtPopularity - userPopularity)

    if (liklihood > 5)
      liklihood = 5
    if (liklihood < 1)
      liklihood = 1

    this.liklihood = liklihood

    var moods = Array();
    moods[1] = 'will';
    moods[2] = 'probably will';
    moods[3] = 'might';
    moods[4] = "probably won't";
    moods[5] = 'will not';

    this.mood = moods[liklihood];
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
