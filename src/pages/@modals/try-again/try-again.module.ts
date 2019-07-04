import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TryAgainPage } from './try-again';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TryAgainPage,
  ],
  imports: [
    IonicPageModule.forChild(TryAgainPage),
    TranslateModule.forChild()
  ],
})
export class TryAgainPageModule {}
