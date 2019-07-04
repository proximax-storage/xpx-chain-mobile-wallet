import { Pipe, PipeTransform } from '@angular/core';
import { Address } from 'nem-library';

/**
 * Generated class for the NemAddressPrettyPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'nemAddressPretty',
})
export class NemAddressPrettyPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return new Address(value).pretty();
  }
}
