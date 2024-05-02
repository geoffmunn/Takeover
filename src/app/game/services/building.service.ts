import { Inject } from '@angular/core';
import { GovtTypesService } from './govt-types.service';
import { LowerCasePipe } from '@angular/common';

export class BuildingService {

  public grid: any            = {}
  public image: string         = '';  // Static - doesn't change
  public leaning: number       = 0;   // Only used at the starting summary
  public liklihood: number     = 0;   // Constantly changing depending on game progress
  public mood: string          = '';  // A string representation of the liklihood value
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

  calculateLiklihood(userPopularity: number, govtPopularity: number, squareMood: number){

  // 443 B=M5(Y-1,X)+M5(Y+1,X)+M5(Y,X+1)+M5(Y,X-1)
  // 444 B=B+M5(Y-1,X-1)+M5(Y+1,X+1)+M5(Y-1,X+1)+M5(Y+1,X-1)
  // ##### Now take the building values (I think)
  // 448 B=INT(B(J)+B/2+G2-P2):IFB<1THENB=1
  // 449 IFB>5THENB=5

// 50 D$=U3$:B(J)=3-ABS(L(J)-G1)+ABS(L(J)-P1)+G(J)  ### U3$ is green.  $b[$j]=3-abs($l[$j]-$G1)+abs($l[$j]-$p1)+$G[$j]  
// 52 B=INT(B(J)+G2-P2):IFB>=5THENB=5:D$=UN$
// 53 IFB<=1THENB=1:D$=UM$

    //let score = 3 - Math.abs(this.leaning - govtType) + Math.abs(this.leaning - userType) + this.proGovernment
    //let liklihood = Math.floor(score + govtPopularity - userPopularity)

    // console.log (this.name,'leaning=',this.leaning)
    // console.log (squareMood/2)
    // console.log (govtPopularity)
    // console.log (userPopularity)
    var liklihood = Math.floor(this.liklihood + (squareMood / 2) + govtPopularity - userPopularity);

  //   square mood: 0
  // building.service.ts:46 Bank leaning= 3
  // building.service.ts:47 0
  // building.service.ts:48 2.225
  // building.service.ts:49 3.625
  // building.service.ts:52 1
    // console.log (liklihood)

    if (liklihood > 5)
      liklihood = 5
    if (liklihood < 1)
      liklihood = 1

    //this.liklihood = liklihood

    var moods = Array();
    moods[1] = 'will';
    moods[2] = 'probably will';
    moods[3] = 'might';
    moods[4] = "probably won't";
    moods[5] = 'will not';

    this.mood = moods[liklihood];
    //console.log('new liklihood:', this.liklihood)
    //console.log('new mood:',this.mood)

    return liklihood
  }

  getDetails(){
    return {
      'name': this.name,
      'leaning': this.leaning,
      'proGovernment': this.proGovernment,
      'points': this.points
    }
  }

  setGridCoords(x:number, y:number){
    this.grid = {'x': x, 'y': y};
  }
}
