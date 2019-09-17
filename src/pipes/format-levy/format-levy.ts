import { Pipe, PipeTransform } from '@angular/core';
import { ProximaxProvider } from '../../providers/proximax/proximax';

/**
 * Generated class for the FormatLevyPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatLevy',
})
export class FormatLevyPipe implements PipeTransform {
  constructor(private proximaxProvider: ProximaxProvider,) {
  }

  transform(value): any {
      return this.proximaxProvider.formatLevy(value);
  }
}
