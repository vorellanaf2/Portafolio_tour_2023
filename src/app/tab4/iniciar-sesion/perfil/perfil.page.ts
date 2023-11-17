import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userData: any;
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  user = {} as User;

  constructor(private firestore: AngularFirestore) { 
      this.user = this.utilsSvc.getUserFromLocalStorage();
    }

  ngOnInit() { 
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
          console.error('Error al editado elemento: ', error);
        }); 
  }
  //========== CERRAR SESION ===========
  signOut(){
    this.firebaseSvc.signOut();
  }


}
