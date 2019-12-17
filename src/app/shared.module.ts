import { NgModule} from '@angular/core';

import { ImportanceTransferTransactionComponent } from '../pages/@core/transactions/transaction-list-partials/importance-transfer-transaction/importance-transfer-transaction';
import { MosaicDefinitionTransactionComponent } from '../pages/@core/transactions/transaction-list-partials/mosaic-definition-transaction/mosaic-definition-transaction';
import { MosaicSupplyChangeTransactionComponent } from '../pages/@core/transactions/transaction-list-partials/mosaic-supply-change-transaction/mosaic-supply-change-transaction';
// import { MultisigTransactionComponent } from '../pages/@core/transactions/transaction-list-partials/multisig-transaction/multisig-transaction';
import { ProvisionNamespaceTransactionComponent } from '../pages/@core/transactions/transaction-list-partials/provision-namespace-transaction/provision-namespace-transaction';
import { TransactionComponent } from '../pages/@core/transactions/transaction-list-partials/transactions/transactions';
import { MultisigAggregateModificationTransactionComponent } from '../pages/@core/transactions/transaction-list-partials/multisig-aggregate-modification-transaction/multisig-aggregate-modification-transaction';
import { PipesModule } from '../pipes/pipes.module';
import { IonicModule } from 'ionic-angular';
import { TransferTransactionFilterComponent } from '../pages/@core/transactions/transaction-list-partials/transfer-transaction-filter/transfer-transaction-filter';
import { TranslateModule } from '@ngx-translate/core';
// import { MultisigTransactionFilterComponent } from '../pages/@core/transactions/transaction-list-partials/multisig-transaction-filter/multisig-transaction-filter';

@NgModule({
  imports: [
    PipesModule,
    IonicModule
  ],
  declarations: [
    ImportanceTransferTransactionComponent,
    MosaicDefinitionTransactionComponent,
    MosaicSupplyChangeTransactionComponent,
    // MultisigTransactionComponent,
    // MultisigTransactionFilterComponent,
    ProvisionNamespaceTransactionComponent,
    TransactionComponent,
    TransferTransactionFilterComponent,
    MultisigAggregateModificationTransactionComponent
  ],
  exports: [
    ImportanceTransferTransactionComponent,
    MosaicDefinitionTransactionComponent,
    MosaicSupplyChangeTransactionComponent,
    // MultisigTransactionComponent,
    // MultisigTransactionFilterComponent,
    ProvisionNamespaceTransactionComponent,
    TransactionComponent,
    TransferTransactionFilterComponent,
    MultisigAggregateModificationTransactionComponent,
    TranslateModule
  ]
})

export class SharedModule { }