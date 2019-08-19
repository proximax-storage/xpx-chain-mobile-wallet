import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { XEM } from 'nem-library';

/**
 * Generated class for the FormatXemPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatXEM'
})
export class FormatXemPipe implements PipeTransform {
  constructor(public decimalPipe: DecimalPipe) {}

  transform(xem: number): any {
    const XEM_AMOUNT = xem / Math.pow(10, XEM.DIVISIBILITY);
    return this.decimalPipe.transform(XEM_AMOUNT, `1.2-${XEM.DIVISIBILITY}`);
  }
}
