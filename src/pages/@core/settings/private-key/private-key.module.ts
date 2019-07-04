import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgxKjuaModule } from 'ngx-kjua';

import { PrivateKeyPage } from './private-key';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PrivateKeyPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivateKeyPage),
    NgxKjuaModule,
    TranslateModule.forChild() 
  ],
})
export class PrivateKeyPageModule {}
