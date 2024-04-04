import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

declare function getToday(): any;
declare function greetings(name: any): any;

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgIf],
  templateUrl: './game.component.html', 
  styleUrl: './game.component.css'
})

export class GameComponent implements OnInit{

  showHide = {
    'intro': true,
    'howToPlay': false,
    'theMap': false,
    'scenarios': false,
    'pickASide': false,
  }
  
  ngOnInit() {
    //getToday(); // without param
    //greetings('geoff'); // with param

    //this.showHide['intro'] = true
    //this.showHide['theMap'] = true
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
