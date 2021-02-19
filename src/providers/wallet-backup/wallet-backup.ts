import { Injectable } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';

import { ToastProvider } from '../toast/toast';
import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the WalletBackupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WalletBackupProvider {
  constructor(
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private translateService: TranslateService
  ) {
  }


  copyToClipboard(privateKey) {

    console.log('copi', privateKey);
    
    this.translateService.get('WALLETS.EXPORT.COPY_PRIVATE_KEY.RESPONSE').subscribe(value => {
      let alertTitle = value;
      return this.clipboard.copy(privateKey).then(_ => {
        return this.toastProvider.show(alertTitle, 3, true);
      });
    });
  }
}
