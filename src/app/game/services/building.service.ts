import { Inject } from '@angular/core';
import { GovtTypesService } from './govt-types.service';
import { LowerCasePipe } from '@angular/common';

export class BuildingService {

  public action: string          = '';
  public grid: any               = {};  // A json object of the grid coordinates
  public image: string           = '';  // Static - doesn't change
  public leaning: number         = 0;   // Only used at the starting summary
  public liklihood: number       = 0;   // This is set at the beginning and is the reference for all takeover attempts
  public mood: string            = '';  // A string representation of floating liklihood value
  public name: string            = '';  // Static - doesn't change
  public owner: number           = 0;   // Changes depending on the game progress
  public points: number          = 0;   // Static - doesn't change
  public proGovernment: number   = 0;   // Only used at the starting summary
  public streetDefection: number = 0;   // The number of streets that might defect on this building's news 

  /**
   * Create a building object with the basic details
   * 
   * @param name 
   * @param leaning 
   * @param proGovernment 
   * @param points 
   */
  constructor(@Inject(String) name:string, @Inject(Number) leaning:number, @Inject(Number) proGovernment: number, @Inject(Number) points: number, streetDefection: number, action: string = '') {
    
    this.action          = action;
    this.grid            = {'x': 0, 'y': 0};
    this.image           = name.toLowerCase().replace(' ', '_') + '.png';
    this.leaning         = leaning;
    this.name            = name;
    this.owner           = 0;
    this.points          = points;
    this.proGovernment   = proGovernment;
    this.streetDefection = streetDefection;

  }

  /**
   * Based on the provided mood and popularities,
   * calculate the liklihood that this building or street will switch.
   * 
   * @param userPopularity 
   * @param govtPopularity 
   * @param squareMood 
   * 
   * @returns number
   */
  calculateLiklihood(user_popularity: number, govt_popularity: number, square_mood: number): number{

    var liklihood:number = Math.floor(this.liklihood + (square_mood / 2) + govt_popularity - user_popularity);

    if (liklihood > 5)
      liklihood = 5;
    if (liklihood < 1)
      liklihood = 1;

    this.mood = this.getMoodFromLiklihood(liklihood);
    
    return liklihood;
  }

  getAction(): string {

    var owner: string = '';
    var action: string = '';

    if (this.owner != 0){
      if (this.owner == -1){
        owner = 'rebel';
      } else if (this.owner == 1){
        owner = 'government';
      }

      action = this.action.replace('[x]', owner)

    } else if (this.name.toLowerCase() == 'cathedral'){
      action = 'The cathedral makes a plea for an end to hostilities';
    }

    return action;
  }

  getConsequence(): string {

    var owner: string = '';
    var consequence: string = '';

    if (this.streetDefection > 0){
      consequence = 'some [x] forces may switch sides';
    } else {
      consequence = '[x] popularity falls';
    }

    if (this.owner != 0){
      if (this.owner == -1){
        owner = 'government';
      } else if (this.owner == 1){
        owner = 'rebel';
      }

      consequence = consequence.replace('[x]', owner)
    } else if (this.name.toLowerCase() == 'cathedral'){
      consequence = 'the cathedral makes a plea for an end to hostilities';
    }

    console.log ('returning consequence:', consequence)
    return consequence.charAt(0).toUpperCase() + consequence.slice(1);
  }

  /**
   * Get a readable name of this building.
   * 
   * @returns string
   */
  getName(): string{

    var name: string = 'the ' + this.name;

    if (this.name.toLowerCase() == 'xerxes palace'){
      name = this.name;
    }

    return name;
  }
  /**
   * Based on the liklihood number, convert this into a readable string
   * 
   * @param liklihood 
   * 
   * @returns string
   */
  getMoodFromLiklihood(liklihood: number): string {

    var moods = Array();

    moods[1] = 'will';
    moods[2] = 'probably will';
    moods[3] = 'might';
    moods[4] = "probably won't";
    moods[5] = 'will not';

    return moods[liklihood];
  }

  /**
   * Store the provided coordinates as the grid location for this building.
   * This is called when the grid is initially set up at the start of the game.
   * 
   * @param x 
   * @param y 
   * 
   * @returns void
   */
  setGridCoords(x:number, y:number): void{
    this.grid = {'x': x, 'y': y};
  }

  /**
   * This is a special function, called at the start when the buildings are initalised.
   * 
   * @param userType 
   * @param userPopularity 
   * @param govtType 
   * @param govtPopularity 
   * 
   * @returns void
   */
  setInitialValues(user_type: number, user_popularity: number, govt_type: number, govt_popularity: number): void{
    let score: number     = 3 - Math.abs(this.leaning - govt_type) + Math.abs(this.leaning - user_type) + this.proGovernment;
    let liklihood: number = Math.floor(score + govt_popularity - user_popularity);

    if (liklihood < 1)
      liklihood = 1;
    if (liklihood > 5)
      liklihood = 5;
    
    // NOTE: this is the ONLY place that this value will be set
    this.liklihood = liklihood;
    this.mood      = this.getMoodFromLiklihood(liklihood);
  }
}
