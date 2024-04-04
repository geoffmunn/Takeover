import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { PoliticalSelection } from './political-selector/political-selector.component';
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgIf, PoliticalSelection],
  templateUrl: './game.component.html', 
  styleUrl: './game.component.css'
})

export class GameComponent {

  userPoliticalSelection:string = ''
  govtPoliticalSelection:string = ''

  showHide = {
    'intro': true,
    'howToPlay': false,
    'theMap': false,
    'scenarios': false,
    'pickASide': false,
  }

  registerUserPoliticalSelection(event:string) {
    this.userPoliticalSelection = event;

    console.log(this.userPoliticalSelection)
  }
  registerGovtPoliticalSelection(event:string) {
    this.govtPoliticalSelection = event;
  }

  nextPage(nextDiv:string){
    for (let key in this.showHide) {
      //let value = this.showHide[key as keyof typeof this.showHide]
      
      if (key == nextDiv) {
        this.showHide[key as keyof typeof this.showHide] = true
      } else {
        this.showHide[key as keyof typeof this.showHide] = false
      }
    }

  }
}
