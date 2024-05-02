import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-score',
  standalone: true,
  imports: [],
  templateUrl: 'game-score.component.html',
  styleUrl: 'game-score.component.css',
})

export class GameScoreComponent {

  @Input({transform: formatScore}) userScore: number = 0
  @Input({transform: formatScore}) govtScore: number = 0

}

function formatScore(value: any) {
  return parseFloat(value.toFixed(2));
}
