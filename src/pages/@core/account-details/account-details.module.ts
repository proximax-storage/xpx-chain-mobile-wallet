import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountDetailsPage } from './account-details';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    AccountDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(AccountDetailsPage), ComponentsModule
  ],
})
export class AccountDetailsPageModule {}
