import { Pipe, PipeTransform } from '@angular/core';

import { ContactsProvider } from '../../providers/contacts/contacts';
/**
 * Generated class for the SearchContactPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchContact'
})
export class SearchContactPipe implements PipeTransform {
  constructor(private contactsProvider: ContactsProvider) {}

  /**
   * Takes raw NEM address and search if it exists in contacts then return the name.
   */
  transform(value: string, ...args) {
    return this.contactsProvider.search(args[0]);
  }
}
