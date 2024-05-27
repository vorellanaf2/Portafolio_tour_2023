// subscription.service.ts

import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService implements OnDestroy {
  private reservaSubscription: Subscription;

  constructor(private firestore: AngularFirestore) {}

  subscribeToReservas(path: string, productoID: string, callback: (reservas: any) => void) {
    // Desuscribirse de la suscripción anterior si existe
    this.unsubscribe();

    // Almacenar la nueva suscripción
    this.reservaSubscription = this.firestore.collection(path).valueChanges().subscribe(reservas => {
      console.log(reservas);
      callback(reservas);
    });
  }

  private unsubscribe() {
    // Desuscribirse de la suscripción anterior si existe
    if (this.reservaSubscription) {
      this.reservaSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    // Desuscribirse al destruir el servicio
    this.unsubscribe();
  }
}
