import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncryptRoutingModule } from './encrypt-routing.module';
import { QrgeneratorPageComponent } from './containers/qrgenerator-page/qrgenerator-page.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    QrgeneratorPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EncryptRoutingModule,
    IonicModule
  ]
})
export class EncryptModule { }
