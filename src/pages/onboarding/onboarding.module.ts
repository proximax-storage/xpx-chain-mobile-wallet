import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingPage } from './onboarding';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OnboardingPage,
  ],
  imports: [
    IonicPageModule.forChild(OnboardingPage),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class OnboardingPageModule {}
