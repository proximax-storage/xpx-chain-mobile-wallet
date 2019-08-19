import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultisigSupportPage } from './multisig-support';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MultisigSupportPage,
  ],
  imports: [
    IonicPageModule.forChild(MultisigSupportPage),
    TranslateModule.forChild() 
  ],
})
export class MultisigSupportPageModule {}
