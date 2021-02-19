import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionComponent } from './transactions';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TransactionComponent,
  ],
  imports: [
    IonicPageModule.forChild(TransactionComponent),
    TranslateModule.forChild() 
  ],
})
export class WalletAddPageModule {}
