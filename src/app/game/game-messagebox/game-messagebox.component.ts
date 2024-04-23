import { AfterViewInit, Component } from '@angular/core';
import Typewriter from '@philio/t-writer.js'


@Component({
  selector: 'app-game-messagebox',
  standalone: true,
  imports: [],
  template: `
    <div id="messageBox"></div>
  `,
  styles: ``
})
export class GameMessageboxComponent implements AfterViewInit {
  
  ngAfterViewInit() {
    const target = document.querySelector('#messageBox')

    const writer = new Typewriter(target, {
      loop: false,
      typeColor: 'blue'
    })
    
    writer
      .type('Your turn - start the revolution!')
      .rest(500)
      .start()
  }
}
