import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule, 
    IonicModule.forRoot(),
    RouterModule.forRoot([
      {
        path: 'backup',
        loadChildren: () => import('./features/encrypt/encrypt.module').then(m => m.EncryptModule)
      },
      {
        path: '',
        redirectTo: 'backup',
        pathMatch: 'full'
      }
    ])
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    }
  ]
})
export class AppModule { }
