import { Component } from '@angular/core';

/**
 * Generated class for the SkeletonLoaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'skeleton-loader',
  templateUrl: 'skeleton-loader.html'
})
export class SkeletonLoaderComponent {

  text: string;

  constructor() {
    console.log('Hello SkeletonLoaderComponent Component');
    this.text = 'Hello World';
  }

}
