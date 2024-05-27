import { Component, OnInit, inject,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { v4 as uuidv4 } from 'uuid';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss'],
})
export class ReservasComponent  implements OnInit {
  @Input() reservas: any[];
  @Input() productoID: string;
  @Input() reservaUid:string;
  user = {} as User;

  constructor(
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {}
  actualizarEstado(reserva: any) {
    const estadoActualizado = reserva.estado; // Puedes cambiar esto según tus necesidades
  
    // Actualizar la reserva con el nuevo campo
    this.firestore
      .collection('Reserva')
      .doc(reserva.uid)
      .update({ estado: estadoActualizado })  // Cambiado de estadoActualizado a estado
      .then(() => {
        console.log('Estado actualizado con éxito');
      })
      .catch((error) => {
        console.error('Error al actualizar el estado: ', error);
      });
  }
  
  
  
  

}
