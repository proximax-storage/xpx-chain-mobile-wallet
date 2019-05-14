import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WalletMosaicsPage } from './wallet-mosaics.page';

const routes: Routes = [
  {
    path: '',
    component: WalletMosaicsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WalletMosaicsPage]
})
export class WalletMosaicsPageModule {}
