import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletAddPrivateKeyPage } from './wallet-add-private-key';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    WalletAddPrivateKeyPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletAddPrivateKeyPage),
    DirectivesModule,
    TranslateModule.forChild() 
  ],
})
export class WalletAddPrivateKeyPageModule {}
