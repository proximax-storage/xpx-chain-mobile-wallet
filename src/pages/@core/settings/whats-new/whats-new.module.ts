import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WhatsNewPage } from './whats-new';

@NgModule({
  declarations: [
    WhatsNewPage,
  ],
  imports: [
    IonicPageModule.forChild(WhatsNewPage),
  ],
})
export class WhatsNewPageModule {}
