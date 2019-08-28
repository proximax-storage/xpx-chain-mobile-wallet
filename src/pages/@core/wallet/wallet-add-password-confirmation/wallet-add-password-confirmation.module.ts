import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletAddPasswordConfirmationPage } from './wallet-add-password-confirmation';

@NgModule({
  declarations: [
    WalletAddPasswordConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletAddPasswordConfirmationPage),
  ],
})
export class WalletAddPasswordConfirmationPageModule {}
