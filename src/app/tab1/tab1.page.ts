import { Component, inject, Input, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController, IonRefresher } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  cards: any[] = [];
  showContent = false;
  user: User | null = null;

  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private dataSharingService: DataSharingService,
    private dataService: DataService,
    private userService: UserService,
    private alertController: AlertController
  ){
    // if (!this.user) {
    //  this.showContent = true;
      //this.loadUserData();
    //}
    
  }

  ngOnInit() {}
  loadUserData() {
    this.firestore
      .collection('Propiedad')
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          const direccion = doc.direccion;
          this.cards.push({
            title: doc.nombre,
            subtitle: doc.direccion,
            content: doc.descripcion,
            monto: doc.monto,
            comuna: doc.comuna,
            imageUrl: doc.image,
            imageAlt: doc.image,
            direccion: direccion,
          });
        });
      });
  }



}