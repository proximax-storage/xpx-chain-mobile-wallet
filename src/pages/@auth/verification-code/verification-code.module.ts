import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { VerificationCodePage } from './verification-code';

@NgModule({
  declarations: [
    VerificationCodePage,
  ],
  imports: [
    IonicPageModule.forChild(VerificationCodePage),
    ComponentsModule
  ],
})
export class VerificationCodePageModule {}
