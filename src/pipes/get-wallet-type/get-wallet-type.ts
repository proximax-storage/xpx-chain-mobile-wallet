import { Pipe, PipeTransform } from '@angular/core';

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
  transform() {
    // return this.getAccountType(value);
  }

  constructor() {}

  // private getAccountType(rawAddress: string): Observable<any> {
  //   const ADDRESS = new Address(rawAddress);

  //   return new Observable(observer => {
  //     this.nemProvider.accountHttp.status(ADDRESS).subscribe(accountInfo => {
  //       if (accountInfo.cosignatories.length) {
  //         observer.next('Shared');
  //       } else {
  //         observer.next('Personal');
  //       }
  //     });
  //   });
  // }
}
