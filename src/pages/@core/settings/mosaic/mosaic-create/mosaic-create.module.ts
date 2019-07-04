import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MosaicCreatePage } from './mosaic-create';

@NgModule({
  declarations: [
    MosaicCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(MosaicCreatePage),
  ],
})
export class MosaicCreatePageModule {}
