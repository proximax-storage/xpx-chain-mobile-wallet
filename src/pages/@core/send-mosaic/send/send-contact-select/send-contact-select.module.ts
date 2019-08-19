import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendContactSelectPage } from './send-contact-select';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SendContactSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(SendContactSelectPage),
    TranslateModule.forChild()
  ],
})
export class SendContactSelectPageModule {}
