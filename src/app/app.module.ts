

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireStorageModule} from '@angular/fire/compat/storage';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { initializeApp } from 'firebase/app';  // Importa initializeApp
import firebase from "firebase/compat/app";
import { UserService } from './services/user.service';
import { ClipboardModule } from 'ngx-clipboard';

firebase.initializeApp(environment.firebaseConfig);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({mode:'md'}), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    provideStorage(() => getStorage()),
    ClipboardModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    const app = initializeApp(environment.firebaseConfig); 
  }
}

