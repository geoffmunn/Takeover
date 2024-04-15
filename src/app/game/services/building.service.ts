import { Inject, Injectable } from '@angular/core';
import { GovtTypesService } from './govt-types.service';

@Injectable({
  providedIn: 'root'
})

export class BuildingService {

  public name: string = ''
  public leaning: number = 0
  public proGovernment: number = 0
  public points: number = 0
  public liklihood: number = 0
  public mood: string = ''
  
  constructor(@Inject(String) name:string, @Inject(Number) leaning:number, @Inject(Number) proGovernment: number, @Inject(Number) points: number) {
    this.name = name;
    this.leaning = leaning;
    this.proGovernment = proGovernment;
    this.points = points
  }

  calculateLiklihood(govtType: string, userType: string, govtPopularity: number, userPopularity: number){

    let govtTypes:any = new GovtTypesService().govtTypes

    let score = 3 - Math.abs(this.leaning - govtTypes[govtType]) + Math.abs(this.leaning - govtTypes[userType]) + this.proGovernment
    let liklihood = Math.floor(score + govtPopularity - userPopularity)

    this.liklihood = liklihood
  }

  getDetails(){

    /*
    var score=3-Math.abs(buildings[i]['leaning']-govt_type)+Math.abs(buildings[i]['leaning']-rebel_type)+buildings[i]['pro-government'];
    var liklihood=Math.floor(score+govt_popularity-rebel_popularity);
    if(liklihood>5)
      liklihood=5;
    if(liklihood<1)
      liklihood=1;
    
    buildings[i]['loyalty']=liklihood;
    
    if(liklihood<=2)
      moodClass=rebel_colour;
    else if(liklihood>=4)
      moodClass=govt_colour;
    else 
      moodClass=neutral_colour;
    */
    //let govtTypes: string[] = ['Communist', 'Socialist', 'Liberal', 'Rightwing', 'Fascist'];
    //let govtTypes = new GovtTypesService().govtTypes

    return {
      'name': this.name,
      'leaning': this.leaning,
      'proGovernment': this.proGovernment,
      'points': this.points
    }
  }


}
