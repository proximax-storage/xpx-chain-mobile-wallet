import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NamespaceListPage } from './namespace-list';

@NgModule({
  declarations: [
    NamespaceListPage,
  ],
  imports: [
    IonicPageModule.forChild(NamespaceListPage),
  ],
})
export class NamespaceListPageModule {}
