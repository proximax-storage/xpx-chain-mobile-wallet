import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgxCurrencyModule } from 'ngx-currency';

import { ReceivePage } from './receive';
import { DirectivesModule } from '../../../directives/directives.module';
import { NgxKjuaModule } from 'ngx-kjua';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReceivePage,
  ],
  imports: [
    IonicPageModule.forChild(ReceivePage),
    NgxCurrencyModule,
    DirectivesModule,
    NgxKjuaModule,
    TranslateModule.forChild() 
  ],
})
export class ReceivePageModule {}
