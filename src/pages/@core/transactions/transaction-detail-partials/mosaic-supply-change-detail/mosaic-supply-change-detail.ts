//"type": 16386

import { Component, Input } from '@angular/core';

import { App } from '../../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';

@Component({
  selector: 'mosaic-supply-change-detail',
  templateUrl: 'mosaic-supply-change-detail.html'
})
export class MosaicSupplyChangeDetailComponent {
  @Input() tx: any;
  App = App;

  constructor(public utils: UtilitiesProvider) {}
}
