import { Inject } from '@angular/core';
import { GovtTypesService } from './govt-types.service';
import { LowerCasePipe } from '@angular/common';

export class BuildingService {

  public grid: any            = {};   // A json object of the grid coordinates
  public image: string         = '';  // Static - doesn't change
  public leaning: number       = 0;   // Only used at the starting summary
  public liklihood: number     = 0;   // This is set at the beginning and is the reference for all takeover attempts
  public mood: string          = '';  // A string representation of floating liklihood value
  public name: string          = '';  // Static - doesn't change
  public owner: number         = 0    // Changes depending on the game progress
  public points: number        = 0;   // Static - doesn't change
  public proGovernment: number = 0;   // Only used at the starting summary

  constructor(@Inject(String) name:string, @Inject(Number) leaning:number, @Inject(Number) proGovernment: number, @Inject(Number) points: number) {
    /*
    Create a building object with the basic details
    */
    this.grid          = {'x': 0, 'y': 0}
    this.image         = name.toLowerCase().replace(' ', '_') + '.png'
    this.leaning       = leaning;
    this.name          = name;
    this.owner         = 0
    this.points        = points
    this.proGovernment = proGovernment;
    
  }

  setInitialValues(userType: number, userPopularity: number, govtType: number, govtPopularity: number){
    let score: number     = 3 - Math.abs(this.leaning - govtType) + Math.abs(this.leaning - userType) + this.proGovernment
    let liklihood: number = Math.floor(score + govtPopularity - userPopularity)

    if (liklihood < 1)
      liklihood = 1
    if (liklihood > 5)
      liklihood = 5
    
    // NOTE: this is the ONLY place that this value will be set
    this.liklihood = liklihood
    this.mood      = this.getMoodFromLiklihood(liklihood)
  }

  calculateLiklihood(userPopularity: number, govtPopularity: number, squareMood: number){

    var liklihood = Math.floor(this.liklihood + (squareMood / 2) + govtPopularity - userPopularity);

    if (liklihood > 5)
      liklihood = 5
    if (liklihood < 1)
      liklihood = 1

    this.mood = this.getMoodFromLiklihood(liklihood)
    
    return liklihood
  }

  setGridCoords(x:number, y:number){
    this.grid = {'x': x, 'y': y};
  }

  getMoodFromLiklihood(liklihood: number) {

    var moods = Array();

    moods[1] = 'will';
    moods[2] = 'probably will';
    moods[3] = 'might';
    moods[4] = "probably won't";
    moods[5] = 'will not';

    return moods[liklihood];
  }
}
