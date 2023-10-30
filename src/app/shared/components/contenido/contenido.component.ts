import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss'],
})
export class ContenidoComponent implements OnInit {
  userType: string = 'empleado'; // Cambia esto según el tipo de usuario actual
  cards: any[] = [];

  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    // Dependiendo del tipo de usuario, agrega las tarjetas correspondientes
    if (this.userType === 'user') {
      this.loadUserData();
    } else if (this.userType === 'empleado') {
      this.loadEmployeeData();
    } else if (this.userType === 'admin') {
      this.loadAdminData();
    }
  }

  ngOnInit(): void {}

  loadUserData() {
    // Obtén datos del usuario desde Firestore
    this.firestore
      .collection('Propiedad')
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          const direccion = doc.direccion; // Cambié el nombre de elementoId a direccion
          this.cards.push({
            title: doc.nombre,
            subtitle: doc.direccion,
            content: doc.descripcion,
            imageUrl: doc.imagen,
            imageAlt: doc.imagen,
            direccion: direccion, // Asegúrate de que el objeto tenga una propiedad "direccion"
          });
        });
      });
  }

  loadEmployeeData() {
    this.firestore
      .collection('Propiedad')
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          const direccion = doc.direccion; // Cambié el nombre de elementoId a direccion
          this.cards.push({
            title: doc.nombre,
            subtitle: doc.direccion,
            content: doc.descripcion,
            monto: doc.monto,
            imageUrl: doc.imagen,
            imageAlt: doc.imagen,
            direccion: direccion, // Asegúrate de que el objeto tenga una propiedad "direccion"
          });
        });
      });
  }

  loadAdminData() {
    // Puedes implementar una función similar para cargar datos de Firestore para administradores.
  }

  handleCardClick(direccion: string) {
    // Aquí puedes navegar a la página de reserva y pasar la dirección
    this.navCtrl.navigateForward(['/reserva', direccion]);
  }

  irCheckInPage(event: Event,direccion:string) {
    event.stopPropagation();
    this.navCtrl.navigateForward(['/check-in',direccion]);
  }

  irCheckOutPage(event: Event,direccion:string) {
    event.stopPropagation();
    this.navCtrl.navigateForward(['/check-out',direccion]);
  }
}
