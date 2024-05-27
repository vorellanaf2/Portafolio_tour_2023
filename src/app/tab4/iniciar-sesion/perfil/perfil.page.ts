import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from 'src/app/services/user.service';
import { EstadisticasComponent } from 'src/app/shared/components/estadisticas/estadisticas.component';
import { Subscription } from 'rxjs';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { CheckComponent } from 'src/app/shared/components/check/check.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, OnDestroy {
  userData: any;
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  user = {} as User;
  showPropiedades = false;
  showCheck = false;
  private subscriptions: Subscription[] = []; // Array para almacenar suscripciones

  constructor(
    private firestore: AngularFirestore,
    private subscriptionService: SubscriptionService,
    private userService: UserService,
    private router: Router
  ) {
    this.user = this.utilsSvc.getUserFromLocalStorage();
    if (this.user.tipoUsuario === 'Admin') {
      this.showPropiedades = true;
    }
    if (this.user.tipoUsuario === 'Empleado') {
      this.showCheck = true;
    }
    // Verificar si el usuario está autenticado al acceder a la página
    if (!this.user || !this.user.uid) {
      this.router.navigate(['/tabs/tab4/iniciar-sesion']);
    }
  }

  ngOnInit() {}

  Propiedades() {
    this.router.navigate(['/tabs/tab2']);
  }

  addUpdateProduct() {
    let path = `Reserva`;

    // Suscribirse y almacenar la suscripción
    const reservaSubscription = this.firestore
      .collection(path)
      .valueChanges()
      .subscribe((reservas) => {
        console.log(reservas);
        this.utilsSvc.presentModal({
          component: EstadisticasComponent,
          cssClass: 'app-update-modal',
          componentProps: {
            reservas: reservas,
          },
        });
      });

    // Almacenar la suscripción
    this.subscriptions.push(reservaSubscription);
  }
  Check() {
    let path = `Propiedad`;
    // Suscribirse y almacenar la suscripción
    const reservaSubscription = this.firestore
      .collection(path)
      .valueChanges()
      .subscribe((reservas) => {
        console.log(reservas);
        this.utilsSvc.presentModal({
          component: CheckComponent,
          cssClass: 'app-update-modal',
          componentProps: {
            reservas: reservas,
          },
        });
      });

    // Almacenar la suscripción
    this.subscriptions.push(reservaSubscription);
  }

  editarItem(uid: string) {
    this.firestore
      .collection(`Usuarios`)
      .doc(uid)
      .update(this.user)
      .then(() => {
        console.log('Elemento editado con éxito');
      })
      .catch((error) => {
        console.error('Error al editar elemento: ', error);
      });
  }

  //========== CERRAR SESION ===========
  signOut() {
    // Desuscribirse de todas las suscripciones
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptionService.ngOnDestroy();
    this.firebaseSvc.signOut();
    this.userService.clearUser();
    this.router.navigate(['/tabs/tab4/iniciar-sesion']);
  }
  ngOnDestroy() {
    // No es necesario desuscribirse aquí, ya que se maneja en el servicio
  }
}
