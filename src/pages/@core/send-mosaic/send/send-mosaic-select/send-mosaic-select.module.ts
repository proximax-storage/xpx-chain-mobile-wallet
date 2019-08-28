import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendMosaicSelectPage } from './send-mosaic-select';
import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SendMosaicSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMosaicSelectPage), PipesModule
  ],
})
export class SendMosaicSelectPageModule {}
