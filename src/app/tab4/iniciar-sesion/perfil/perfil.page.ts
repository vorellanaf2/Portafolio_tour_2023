// perfil.page.ts

import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from 'src/app/services/user.service';

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
  showPropiedades = false;

  constructor(
    private firestore: AngularFirestore,
    private userService: UserService,
    private router: Router
  ) {
    this.user = this.utilsSvc.getUserFromLocalStorage();
    if (this.user.tipoUsuario === 'Admin') {
      this.showPropiedades = true;
    }
    // Verificar si el usuario está autenticado al acceder a la página
    if (!this.user || !this.user.uid) {
      this.router.navigate(['/tabs/tab4/iniciar-sesion']);
    }
  }

  ngOnInit() {}
  Propiedades(){
    this.router.navigate(['/tabs/tab2']);
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
    this.firebaseSvc.signOut();
    this.userService.clearUser();
    this.router.navigate(['/tabs/tab4/iniciar-sesion']);
  }
}
