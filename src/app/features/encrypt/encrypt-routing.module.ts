import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrgeneratorPageComponent } from './containers/qrgenerator-page/qrgenerator-page.component';

const routes: Routes = [
  {
    path: '',
    component: QrgeneratorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncryptRoutingModule { }
