import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NamespaceCreatePage } from './namespace-create';
import { DirectivesModule } from '../../../../../directives/directives.module';

@NgModule({
  declarations: [
    NamespaceCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(NamespaceCreatePage),
    DirectivesModule
  ],
})
export class NamespaceCreatePageModule {}
