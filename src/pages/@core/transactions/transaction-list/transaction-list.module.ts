import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionListPage } from './transaction-list';
import { SharedModule } from '../../../../app/shared.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { ComponentsModule } from '../../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TransactionListPage
  ],
  entryComponents: [
  ],
  imports: [IonicPageModule.forChild(TransactionListPage), SharedModule, PipesModule, ComponentsModule, TranslateModule.forChild() ]
})
export class TransactionListPageModule {}
