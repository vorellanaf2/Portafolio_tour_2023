import { Component, OnInit, inject, Input } from '@angular/core';
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
  cards: any[] = [];
  user = {} as User;
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  constructor(
    private firestore: AngularFirestore,
  ) {}

  ngOnInit() {
    this.loadEmployeeData();
  }
  toggleLike(card) {
    card.liked = !card.liked;
  }
  loadEmployeeData() {
    let path = `Usuarios/${this.user_new().uid}/Reserva`;
    this.firestore
      .collection(path)
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          this.cards.push({
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
  user_new(): User{
    return this.utilsSvc.getFromLocalStorage('Usuarios');
  }
}
