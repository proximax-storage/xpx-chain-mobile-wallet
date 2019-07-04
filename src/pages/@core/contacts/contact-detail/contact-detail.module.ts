import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactDetailPage } from './contact-detail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContactDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactDetailPage),
    TranslateModule.forChild() 
  ],
})
export class ContactDetailPageModule {}
