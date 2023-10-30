import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FirebaseService } from './services/firebase.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AngularFireModule,
    BrowserModule, 
    IonicModule.forRoot({mode:'md'}), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  providers: 
  [{ 
    provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy 
  },FirebaseService],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
