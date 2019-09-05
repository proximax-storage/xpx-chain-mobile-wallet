import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaucetPage } from './faucet';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FaucetPage,
  ],
  imports: [
    IonicPageModule.forChild(FaucetPage),
    TranslateModule.forChild() 
  ],
})
export class FaucetPageModule {}
