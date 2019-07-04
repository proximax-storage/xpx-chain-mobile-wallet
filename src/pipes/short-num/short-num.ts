import { Pipe, PipeTransform } from '@angular/core';
import * as shortNum from 'short-num';

/**
 * Generated class for the ShortNumPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'shortNum',
})
export class ShortNumPipe implements PipeTransform {
  /**
   * Takes a number and makes abbreviate a number and add unit letters.
   */
  transform(value: string, ...args) {
    return shortNum(value, 2, [' thousand', ' million', ' billion', ' trillion']);
  }
}
