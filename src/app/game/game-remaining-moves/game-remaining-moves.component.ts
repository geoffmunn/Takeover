import { Component, Input } from '@angular/core';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-game-remaining-moves',
  standalone: true,
  imports: [],
  templateUrl: 'game-remaining-moves.component.html',
  styleUrl: 'game-remaining-moves.component.css',
})

export class GameRemainingMovesComponent {
  @Input() remainingMoves: number = 0
  @Input({transform: updateClass}) currentPlayer!: string

}

function updateClass(value: PlayerService) {
  console.log('remaining moves:', value)

  return value.position.css;
}
