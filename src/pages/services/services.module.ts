import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesPage } from './services';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicesPage),
    TranslateModule.forChild() 
  ],
})
export class ServicesPageModule {}
