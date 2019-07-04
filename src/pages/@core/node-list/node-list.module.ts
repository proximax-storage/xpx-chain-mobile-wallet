import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NodeListPage } from './node-list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NodeListPage,
  ],
  imports: [
    IonicPageModule.forChild(NodeListPage),
    TranslateModule.forChild()
  ],
})
export class NodeListPageModule {}
