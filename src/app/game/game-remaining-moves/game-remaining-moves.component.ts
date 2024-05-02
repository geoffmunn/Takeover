import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-remaining-moves',
  standalone: true,
  imports: [],
  templateUrl: 'game-remaining-moves.component.html',
  styleUrl: 'game-remaining-moves.component.css',
})

export class GameRemainingMovesComponent {
  @Input() remainingMoves: number = 0
}
