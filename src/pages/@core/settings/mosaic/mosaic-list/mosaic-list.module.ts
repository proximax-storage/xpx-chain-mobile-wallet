import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MosaicListPage } from './mosaic-list';

@NgModule({
  declarations: [
    MosaicListPage,
  ],
  imports: [
    IonicPageModule.forChild(MosaicListPage),
  ],
})
export class MosaicListPageModule {}
