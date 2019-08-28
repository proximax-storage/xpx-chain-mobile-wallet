//"type": 4700

import { Component, Input } from '@angular/core';
import { App } from '../../../../../providers/app/app';

@Component({
    selector: 'multisig-aggregate-modification-transaction',
    templateUrl: 'multisig-aggregate-modification-transaction.html'
})

export class MultisigAggregateModificationTransactionComponent {
    @Input() tx: any;
    App = App;
}


