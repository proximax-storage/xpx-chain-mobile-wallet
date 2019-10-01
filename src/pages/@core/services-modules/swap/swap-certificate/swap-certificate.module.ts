import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwapCertificatePage } from './swap-certificate';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SwapCertificatePage,
  ],
  imports: [
    IonicPageModule.forChild(SwapCertificatePage),
    TranslateModule.forChild() 
  ],
})
export class SwapCertificatePageModule {}
