//"type": 2049

import { Component, Input } from '@angular/core';

import { App } from '../../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';

@Component({
  selector: 'importance-transfer-detail',
  templateUrl: 'importance-transfer-detail.html'
})
export class ImportanceTransferDetailComponent {
  @Input() tx: any;
  App = App;

  constructor(public utils: UtilitiesProvider) {}
}
