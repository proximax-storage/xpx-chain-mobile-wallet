import { Pipe, PipeTransform } from '@angular/core';
import { NemProvider } from '../../providers/nem/nem';

/**
 * Generated class for the FormatLevyPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatLevy',
})
export class FormatLevyPipe implements PipeTransform {
  constructor(public nem: NemProvider) {
  }

  transform(value): any {
      return this.nem.formatLevy(value);
  }
}
