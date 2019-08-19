import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MultisignAccountInfoPage } from './multisign-account-info';

@NgModule({
  declarations: [
    MultisignAccountInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MultisignAccountInfoPage),
  ],
})
export class MultisignAccountInfoPageModule {}
