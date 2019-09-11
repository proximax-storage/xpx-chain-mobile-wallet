import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';

import { NemProvider } from '../nem/nem';
import { AuthProvider } from '../auth/auth';
import { ToastProvider } from '../toast/toast';
import { AlertProvider } from '../alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { SimpleWallet, Password } from 'tsjs-xpx-chain-sdk';

/*
  Generated class for the WalletBackupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WalletBackupProvider {
  constructor(
    private file: File,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private authProvider: AuthProvider,
    private nemProvider: NemProvider,
    private toastProvider: ToastProvider,
    private alertProvider: AlertProvider,
    private translateService: TranslateService
  ) {
    console.log('Hello WalletBackupProvider Provider');
  }

  
  copyToClipboard(privateKey) {
    this.translateService.get('WALLETS.EXPORT.COPY_PRIVATE_KEY.RESPONSE').subscribe(
      value => {
        let alertTitle = value;
        return this.clipboard.copy(privateKey)
      .then(_ => {
        return this.toastProvider.show(alertTitle,
          3,
          true
        );
      });
      }
    )
    
  }
}
