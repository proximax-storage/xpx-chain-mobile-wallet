import { Pipe, PipeTransform } from '@angular/core';
import { NemProvider } from '../../providers/nem/nem';
import { Observable } from 'rxjs';
import { Address } from 'nem-library';

/**
 * Generated class for the GetWalletTypePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'getWalletType'
})
export class GetWalletTypePipe implements PipeTransform {
  /**
   * Takes raw address and get the wallet type base on cosigners count.
   */
  transform(value: string, ...args) {
    return this.getAccountType(value);
  }

  constructor(private nemProvider: NemProvider) {}

  private getAccountType(rawAddress: string): Observable<any> {
    const ADDRESS = new Address(rawAddress);

    return new Observable(observer => {
      this.nemProvider.accountHttp.status(ADDRESS).subscribe(accountInfo => {
        if (accountInfo.cosignatories.length) {
          observer.next('Shared');
        } else {
          observer.next('Personal');
        }
      });
    });
  }
}
