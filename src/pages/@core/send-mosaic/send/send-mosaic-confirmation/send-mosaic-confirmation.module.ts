import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { SendMosaicConfirmationPage } from './send-mosaic-confirmation';
import { PipesModule } from '../../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SendMosaicConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(SendMosaicConfirmationPage),
    PipesModule,
    TranslateModule.forChild() 
  ],
  providers: [DecimalPipe]
})
export class SendMosaicConfirmationPageModule {}
