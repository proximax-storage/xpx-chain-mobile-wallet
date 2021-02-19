import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMosaicSelectPage } from './send-mosaic-select';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SendMosaicSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMosaicSelectPage),
    PipesModule,
    TranslateModule.forChild() 
  ],
})
export class SendMosaicSelectPageModule {}
