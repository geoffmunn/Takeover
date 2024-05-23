import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import Typewriter from '@philio/t-writer.js'

@Component({
  selector: 'app-game-messagebox',
  standalone: true,
  imports: [],
  template: `
    <section id="messageBoxContainer" class="rebels"><div id="messageBox"></div></section>
  `,
  styleUrl: 'game-messagebox.component.css',
})

export class GameMessageboxComponent implements AfterViewInit {

  @Input() 
    public set message(val: any) {
      this.typeText(val)
    }

  typeText(message:any){

    // var msgboxContainer = this.el.nativeElement.querySelector('section#messageBoxContainer')
    // msgboxContainer.removeChild(msgboxContainer.firstElementChild)

    // var msgbox:HTMLDivElement = this.renderer.createElement('div')
    // this.renderer.setAttribute(msgbox, 'id', 'messageBox')

    // this.renderer.appendChild(msgboxContainer, msgbox)

    const target = document.querySelector('div#messageBox')

    target!.innerHTML = ''

    const writer = new Typewriter(target, {
      loop: false
    })

    writer
      .type(message.msg)
      .rest(500)
      .start()

  }

  ngAfterViewInit(){
    this.typeText({'msg': 'Your turn - start the revolution!'})
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
    
  }
}
