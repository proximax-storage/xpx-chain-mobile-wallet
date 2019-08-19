import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PinComponent } from './pin/pin';
import { ModalHeaderComponent } from './modal-header/modal-header';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader';
@NgModule({
  declarations: [
    PinComponent,
    ModalHeaderComponent,
    SkeletonLoaderComponent,
  ],
  imports: [IonicModule],
  exports: [
    PinComponent,
    ModalHeaderComponent,
    SkeletonLoaderComponent
  ]
})
export class ComponentsModule { }
