import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-score',
  standalone: true,
  imports: [],
  templateUrl: 'game-score.component.html',
  styleUrl: 'game-score.component.css',
})
export class GameScoreComponent {

  @Input() userScore: number = 0
  @Input() govtScore: number = 0


  // ngAfterViewInit(): void {
  //   // console.log(this.user)
  //   // console.log (this.test)

  //   // this.userPlayer = this.user
  //   // this.govtPlayer = this.user

  //   this.geoff = this.test

    
  //   console.log (this.geoff)
  //   this.userScore = this.geoff.popularity

  // }
  
  // ngOnChanges() {
   
  //   this.userScore = this.geoff.popularity
    
  // }
}
