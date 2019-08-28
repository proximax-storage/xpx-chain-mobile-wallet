import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivateKeyPasswordPage } from './private-key-password';

@NgModule({
  declarations: [
    PrivateKeyPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivateKeyPasswordPage),
  ],
})
export class PrivateKeyPasswordPageModule {}
