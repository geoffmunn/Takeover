
import { Component, Input, SimpleChanges } from '@angular/core';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-game-popularity',
  standalone: true,
  imports: [],
  templateUrl: 'game-popularity.component.html',
  styleUrl: 'game-popularity.component.css',
})
export class GamePopularityComponent {
  @Input() userPopularity: number = 0
  @Input() govtPopularity: number = 0
  @Input() user!: PlayerService
  @Input() govt!: PlayerService

  userStyle: string = '0px';
  govtStyle: string = '0px';
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['govtPopularity'] && changes['govtPopularity'].currentValue) {
      this.govtStyle = this.govtPopularity * 10 + 'px'
    }
    if (changes['userPopularity'] && changes['userPopularity'].currentValue) {
      this.userStyle = this.userPopularity * 10 + 'px';
    }
  }

}
