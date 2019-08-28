import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgxKjuaModule } from 'ngx-kjua';

import { ReceiveQrCodePage } from './receive-qr-code';

@NgModule({
  declarations: [
    ReceiveQrCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveQrCodePage),
    NgxKjuaModule,
  ],
})
export class ReceiveQrCodePageModule {}
