import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';

import { SimpleWallet, Password } from 'nem-library';
import { NemProvider } from '../nem/nem';
import { AuthProvider } from '../auth/auth';
import { ToastProvider } from '../toast/toast';
import { AlertProvider } from '../alert/alert';
import { TranslateService } from '@ngx-translate/core';

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

  saveAsFile(wallet: SimpleWallet): Promise<any> {
    const WALLET_NAME = wallet.name + '.wlt';
    const STORAGE_DIRECTORY =
      this.file.externalApplicationStorageDirectory + 'files';

    return this.authProvider
      .getPassword()
      .then(password => {
        const QR_TEXT = this.nemProvider.generateWalletQRText(password, wallet);

        return this.file.writeFile(STORAGE_DIRECTORY, WALLET_NAME, QR_TEXT, {
          replace: true
        });
      })
      .then(result => {
        this.alertProvider.showMessage(
          `You can view your backed up wallet in ${STORAGE_DIRECTORY}`
        );
        return result;
      })
      .catch(e => {
        console.log(e);
      });
  }

  saveToGoogleDrive(wallet: SimpleWallet) {
    return this.socialSharing
      .canShareVia(
        'com.google.android.apps.docs',
        wallet.writeWLTFile(),
        wallet.name + '.wlt'
      )
      .then(_ => {
        console.log('saveToGoogleDrive', wallet.writeWLTFile());
        console.log('com.google.android.apps.docs', _);

        return this.toastProvider.show(
          'Saved to google drive successfully',
          3,
          true
        );
      });
  }

  copyToClipboard(wallet: SimpleWallet) {
    this.translateService.get('WALLETS.EXPORT.COPY_PRIVATE_KEY.RESPONSE').subscribe(
      value => {
        // value is our translated string
        let alertTitle = value;

        return this.authProvider
      .getPassword()
      .then(password => {
        const PASSWORD = new Password(password);
        const PRIVATE_KEY = wallet.unlockPrivateKey(PASSWORD);

        return this.clipboard.copy(PRIVATE_KEY);
      })
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
