import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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

  @Input() 
    public set message(val: string) {
      this.typeText(val)
    }

  typeText(message:string){
    const target = document.querySelector('#messageBox')

    target!.innerHTML = ''

    const writer = new Typewriter(target, {
      loop: false,
      typeColor: 'blue'
    })

    writer
      .type(message)
      .rest(500)
      .start()

  }

  ngAfterViewInit(){
    this.typeText('Your turn - start the revolution!')
  }
}
