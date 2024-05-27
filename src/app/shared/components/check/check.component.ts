import { Component, OnInit,Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent  implements OnInit {
  @Input() reservas: any[];

  constructor(    private firestore: AngularFirestore,
    private navCtrl: NavController,) { }

  ngOnInit() {}
  actualizarEstado(reserva: any) {

    const estadoActualizado = reserva.estado; // Puedes cambiar esto según tus necesidades
  
    // Actualizar la reserva con el nuevo campo
    this.firestore
      .collection(`Reserva`)
      .doc(reserva.uid)
      .update({ estadoActualizado })
      .then(() => {
        console.log('Nuevo campo de estado agregado con éxito');
      })
      .catch((error) => {
        console.error('Error al agregar el nuevo campo de estado: ', error);
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



