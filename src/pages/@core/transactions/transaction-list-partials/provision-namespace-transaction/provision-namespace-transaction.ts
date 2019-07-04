//type: 8193

import { Component, Input } from '@angular/core';
import { App } from '../../../../../providers/app/app';

@Component({
  selector: 'provision-namespace-transaction',
  templateUrl: 'provision-namespace-transaction.html'
})
export class ProvisionNamespaceTransactionComponent {
  @Input() tx: any;
  App = App;

  constructor() {}
}
