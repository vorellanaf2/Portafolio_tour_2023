import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  reservationCards: any[] = [];
  propertyCards: any[] = [];
  user = {} as User;
  reservationsTotalByProperty: { [propertyUid: string]: number } = {};
  propertyReservations: { [key: string]: number } = {};

  constructor(
    private firestore: AngularFirestore,
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadReservationData();
    this.loadPropertyData();
  }

  toggleLike(card) {
    card.liked = !card.liked;
  }

  loadReservationData() {
    let path = `Usuarios/${this.user_new().uid}/Reserva`;
    this.firestore
      .collection(path)
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          this.reservationCards.push({
            direccion: doc.direccion,
            direccionUser: doc.direccionUser,
            monto: doc.monto,
            fechaInicio: doc.fechaInicio,
            fechaTermino: doc.fechaTermino,
            diasArriendo: doc.diasArriendo,
            transporte: doc.transporte,
            metodoPago: doc.metodoPago,
            total: doc.total,
          });
        });
      });
  }

  loadPropertyData() {
    let path = `Usuarios/${this.user_new().uid}/Propiedad/`;
    this.firestore
      .collection(path)
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          this.propertyCards.push({
            uid: doc.uid,
            direccion: doc.direccion,
            direccionUser: doc.direccionUser,
            monto: doc.monto,
            fechaInicio: doc.fechaInicio,
            fechaTermino: doc.fechaTermino,
            diasArriendo: doc.diasArriendo,
            transporte: doc.transporte,
            metodoPago: doc.metodoPago,
            total: doc.total,
          });
        });
      });
  }

  loadReservationsForProperty(propertyUid: string) {
    let path = `Usuarios/${this.user_new().uid}/Propiedad/${propertyUid}/Reserva`;
    this.firestore
      .collection(path)
      .valueChanges()
      .subscribe((reservations: any[]) => {
        this.propertyReservations[propertyUid] = reservations.length;
      });
  }
  
  user_new(): User {
    return this.utilsSvc.getFromLocalStorage('Usuarios');
  }
}
