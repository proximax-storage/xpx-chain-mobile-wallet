import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPage } from './send';

import { NgxCurrencyModule } from "ngx-currency";
import { DirectivesModule } from '../../../../directives/directives.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SendPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPage),
    NgxCurrencyModule,
    DirectivesModule,
    PipesModule,
    TranslateModule.forChild() 
  ],
})
export class SendPageModule {}
