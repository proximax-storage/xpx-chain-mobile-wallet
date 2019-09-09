import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportWalletPage } from './import-wallet';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../../../../../directives/directives.module';

@NgModule({
  declarations: [
    ImportWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(ImportWalletPage),
    TranslateModule.forChild(),
    DirectivesModule
  ],
})
export class ImportWalletPageModule {}
