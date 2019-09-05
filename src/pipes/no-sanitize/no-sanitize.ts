import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Generated class for the NoSanitizePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'noSanitize',
})
export class NoSanitizePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor(private domSanitizer: DomSanitizer) {

  }
  transform(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }
}
