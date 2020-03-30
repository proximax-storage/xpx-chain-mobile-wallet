import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiftCardsPage } from './gift-cards';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GiftCardsPage,
  ],
  imports: [
    IonicPageModule.forChild(GiftCardsPage),
    TranslateModule.forChild() 
  ],
})
export class GiftCardsPageModule {}
