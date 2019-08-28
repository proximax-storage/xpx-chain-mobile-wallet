//"type": 16386

import { Component, Input } from '@angular/core';

import { App } from '../../../../../providers/app/app';

@Component({
    selector: 'mosaic-supply-change-transaction',
    templateUrl: 'mosaic-supply-change-transaction.html'
})

export class MosaicSupplyChangeTransactionComponent {
    @Input() tx: any;
    App = App;
}
