import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ReservasComponent } from '../shared/components/reservas/reservas.component';
import { Subscription } from 'rxjs';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  reservationCards: any[] = [];
  propertyCards_reserva: any[] = [];
  propertyCards: any[] = [];
  selectedSegment: string = 'graph1';
  user = {} as User;
  totalReservas: number;
  numberOfElements: number;
  propertyReservaLengths: { [key: string]: number } = {};
  direccionKeys: string[] = [];
  private reservaSubscription: Subscription; // Suscripción a desuscribir

  constructor(
    private firestore: AngularFirestore,
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService,
    private navCtrl: NavController,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.loadReservationData();
    this.loadPropertyData();
    this.loadPropertyData_reserva();
  }
  ngOnDestroy() {
    // No es necesario desuscribirse aquí, ya que se maneja en el servicio
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
        this.reservationCards = data.map(doc => ({
          direccion: doc.direccion,
          direccionUser: doc.direccionUser,
          monto: doc.monto,
          fechaInicio: doc.fechaInicio,
          fechaTermino: doc.fechaTermino,
          diasArriendo: doc.diasArriendo,
          transporte: doc.transporte,
          metodoPago: doc.metodoPago,
          total: doc.total,
          uid: doc.productoID
        }));
      });
  }

  loadPropertyData() {
    let path = `Usuarios/${this.user_new().uid}/Propiedad/`;
    this.firestore
      .collection(path)
      .valueChanges()
      .subscribe((data: any[]) => {
        this.propertyCards = data.map(doc => ({
          uid: doc.productoID,
          direccion: doc.direccion,
          direccionUser: doc.direccionUser,
          monto: doc.monto,
          fechaInicio: doc.fechaInicio,
          fechaTermino: doc.fechaTermino,
          diasArriendo: doc.diasArriendo,
          transporte: doc.transporte,
          metodoPago: doc.metodoPago,
          total: doc.total,
        }));
      });
  }

  loadPropertyData_reserva() {
    let path = `Reserva`;
    this.firestore
      .collection(path)
      .valueChanges()
      .subscribe((data: any[]) => {
        this.propertyCards_reserva = data.map(doc => {
          const totalPorReserva = doc.monto * doc.diasArriendo;
          const costoTransporte = doc.transporte ? 45000 : 0;
          const totalConTransporte = totalPorReserva + costoTransporte;

          return {
            uid: doc.productoID,
            direccion: doc.direccion,
            direccionUser: doc.direccionUser,
            monto: doc.monto,
            fechaInicio: doc.fechaInicio,
            fechaTermino: doc.fechaTermino,
            diasArriendo: doc.diasArriendo,
            transporte: doc.transporte,
            metodoPago: doc.metodoPago,
            total: doc.total,
            totalPorReserva: totalPorReserva,
            totalConTransporte: totalConTransporte,
          };
        });

        this.propertyReservaLengths = this.calculateTotalByDirection(this.propertyCards_reserva);
        this.direccionKeys = Object.keys(this.propertyReservaLengths);
      });
  }

  calculateTotalByDirection(propertyCards: any[]): { [key: string]: number } {
    const totalByDirection: { [key: string]: number } = {};
    propertyCards.forEach(card => {
      const direction = card.direccion;
      totalByDirection[direction] = (totalByDirection[direction] || 0) + card.totalPorReserva;
    });
    return totalByDirection;
  }

  countDirections(propertyCards: any[]): { [key: string]: number } {
    const directionCount: { [key: string]: number } = {};
    propertyCards.forEach(card => {
      const direction = card.direccion;
      directionCount[direction] = (directionCount[direction] || 0) + 1;
    });
    return directionCount;
  }
  
  user_new(): User {
    return this.utilsSvc.getFromLocalStorage('Usuarios');
  }

  addUpdateProduct(productoID: string) {
    let path = `Usuarios/${this.user_new().uid}/Propiedad/${productoID}/Reserva`;

    // Utilizar el servicio para la suscripción
    this.subscriptionService.subscribeToReservas(path, productoID, reservas => {
      this.utilsSvc.presentModal({
        component: ReservasComponent,
        cssClass: 'app-update-modal',
        componentProps: {
          reservas: reservas,
          productoID: productoID,
        }
      });
    });
  }
  irCheckInPage(event: Event, direccion: string) {
    event.stopPropagation();
    this.navCtrl.navigateForward(['/check-in', direccion]);
  }

  irCheckOutPage(event: Event, direccion: string) {
    event.stopPropagation();
    this.navCtrl.navigateForward(['/check-out', direccion]);
  }
}
