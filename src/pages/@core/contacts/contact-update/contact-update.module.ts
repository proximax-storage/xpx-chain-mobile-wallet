import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactUpdatePage } from './contact-update';
import { DirectivesModule } from './../../../../directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContactUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(ContactUpdatePage),
    DirectivesModule,
    TranslateModule.forChild() 
  ],
})
export class ContactUpdatePageModule {}
