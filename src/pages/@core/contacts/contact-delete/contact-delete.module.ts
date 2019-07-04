import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactDeletePage } from './contact-delete';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContactDeletePage,
  ],
  imports: [
    IonicPageModule.forChild(ContactDeletePage),
    TranslateModule.forChild() 
  ],
})
export class ContactDeletePageModule {}
