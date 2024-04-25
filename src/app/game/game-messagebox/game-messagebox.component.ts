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
      console.log('new message received!')
      this.typeText(val)
    }

  typeText(message:string){
    const target = document.querySelector('#messageBox')

    // if (target === undefined){
    //   console.log('undefined typewriter')
    // }else {

    //var test = document.querySelector('#messageBox')
    //test!.innerHTML = ''
    target!.innerHTML = ''

    const writer = new Typewriter(target, {
      loop: false,
      typeColor: 'blue'
    })

    writer.clearText()

    writer
      .type(message)
      .rest(500)
      .start()

  }

  // ngOnChanges(changes:any) {
  //   // console.log(changes)
  //   // const target = document.querySelector('#messageBox')

  //   // const writer = new Typewriter(target, {
  //   //   loop: false,
  //   //   typeColor: 'blue'
  //   // })
    
  //   // writer
  //   //   .type(this.message)
  //   //   .rest(500)
  //   //   .start()
  //   //this.typeText()
  // }
  
  ngAfterViewInit(){
    this.typeText('Your turn - start the revolution!')
  }
}
