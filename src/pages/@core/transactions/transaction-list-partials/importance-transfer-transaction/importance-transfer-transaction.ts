//"type": 2049

import { Component, Input } from '@angular/core';

import { App } from '../../../../../providers/app/app';

@Component({
    selector: 'importance-transfer-transaction',
    templateUrl: 'importance-transfer-transaction.html'
})

export class ImportanceTransferTransactionComponent {
    @Input() tx: any;
    App = App;
}
