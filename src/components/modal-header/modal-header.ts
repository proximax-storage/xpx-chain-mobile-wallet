import { Component, Input } from '@angular/core';
/**
 * Generated class for the ModalHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-header',
  templateUrl: 'modal-header.html'
})
export class ModalHeaderComponent {

  text: string;

  @Input() title: string;

  constructor() {
    console.log('Hello ModalHeaderComponent Component');
    this.text = 'Hello World';
  }

}
