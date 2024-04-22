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

}
