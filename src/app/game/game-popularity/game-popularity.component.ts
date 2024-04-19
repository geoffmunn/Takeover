import { Component, Input } from '@angular/core';

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
}
