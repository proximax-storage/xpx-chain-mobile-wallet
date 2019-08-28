import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactAddPage } from './contact-add';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContactAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactAddPage),
    DirectivesModule,
    TranslateModule.forChild() 
  ],
})
export class ContactAddPageModule {}
