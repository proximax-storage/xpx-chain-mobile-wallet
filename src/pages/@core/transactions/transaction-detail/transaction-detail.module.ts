import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionDetailPage } from './transaction-detail';
import { PipesModule } from '../../../../pipes/pipes.module';

import { MosaicDefinitionDetailComponent } from '../transaction-detail-partials/mosaic-definition-detail/mosaic-definition-detail';
import { MosaicSupplyChangeDetailComponent } from '../transaction-detail-partials/mosaic-supply-change-detail/mosaic-supply-change-detail';
import { MultisigAggregateModificationDetailComponent } from '../transaction-detail-partials/multisig-aggregate-modification-detail/multisig-aggregate-modification-detail';
// import { MultisigDetailComponent } from '../transaction-detail-partials/multisig-detail/multisig-detail';
import { ProvisionNamespaceDetailComponent } from '../transaction-detail-partials/provision-namespace-detail/provision-namespace-detail';
import { TransferDetailComponent } from '../transaction-detail-partials/transfer-detail/transfer-detail';
import { ImportanceTransferDetailComponent } from '../transaction-detail-partials/importance-transfer-detail/importance-transfer-detail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TransactionDetailPage,
    ImportanceTransferDetailComponent,
    MosaicDefinitionDetailComponent,
    MosaicSupplyChangeDetailComponent,
    MultisigAggregateModificationDetailComponent,
    // MultisigDetailComponent,
    ProvisionNamespaceDetailComponent,
    TransferDetailComponent,
  ],
  imports: [
    IonicPageModule.forChild(TransactionDetailPage),
    PipesModule,
    TranslateModule.forChild()
  ],
  exports: [
    ImportanceTransferDetailComponent,
    MosaicDefinitionDetailComponent,
    MosaicSupplyChangeDetailComponent,
    MultisigAggregateModificationDetailComponent,
    // MultisigDetailComponent,
    ProvisionNamespaceDetailComponent,
    TransferDetailComponent,
  ]
})
export class TransactionDetailPageModule { }
