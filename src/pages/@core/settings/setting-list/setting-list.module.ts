import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgxKjuaModule } from 'ngx-kjua';

import { SettingListPage } from './setting-list';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SettingListPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingListPage),
    NgxKjuaModule,
    PipesModule,
    TranslateModule.forChild() 
  ],
})
export class SettingListPageModule {}
