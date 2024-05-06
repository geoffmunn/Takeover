import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent],
  template: `
    <router-outlet />
    <app-game></app-game>
  `,
  styles: [],
})
export class AppComponent {
  title = 'Takeover';
}
