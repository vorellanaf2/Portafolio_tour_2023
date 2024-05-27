import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, inject, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from '../add-update-product/add-update-product.component';

@Component({
  selector: 'app-segmento-admin',
  templateUrl: './segmento-admin.component.html',
  styleUrls: ['./segmento-admin.component.scss'],
})
export class SegmentoAdminComponent {
  segment: string = 'formulario';
  registerForm: FormGroup;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;
  items: any[] = [];
  searchTerm: string = '';
  filteredItems: any[] = [];
  empleado: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private firestore: AngularFirestore
  ) {
    // Formulario de Registro
    this.user = this.utilsSvc.getUserFromLocalStorage();
    this.filterItems();
    this.registerForm = this.formBuilder.group({
      uid: [''],
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''],
      telefono: ['+569', [Validators.required, Validators.minLength(10)]],
      tipoUsuario: ['Empleado'],
    });
    if (this.user) {
      if (
        this.user.tipoUsuario === 'Empleado' ||
        this.user.tipoUsuario === 'Admin'
      ) {
        this.loadEmployeeData();
        this.cargarEmpleado();
      }
    }
  }
  //////////////////////////////////////////// OTRA FUNCION REGISTER /////////////////////////////////////////
  register2() {
    if (this.registerForm.valid) {
      this.firebaseSvc
        .signUp(this.registerForm.value as User)
        .then(async (res) => {
          await this.firebaseSvc.updateUser(this.registerForm.value.name);
          let uid = res.user.uid;
          let tipoUsuario = 'Empleado';
          this.registerForm.controls['uid'].setValue(uid);
          this.registerForm.controls['tipoUsuario'].setValue(tipoUsuario);
          this.setUserInfo(uid);
        })
        .catch((error) => {
          this.mostrarAlerta('Error al registrar el usuario: ' + error.message);
          console.log(error);
        });
    } else {
      this.mostrarAlerta('Completa todos los campos antes de registrar.');
    }
  }
  //////////////////////////////////////////// FUNCION SETUSERINFO /////////////////////////////////////////
  setUserInfo(uid: string) {
    let path2 = `Usuarios/${uid}`;
    let path = `Usuarios/${this.user.uid}/Empleado/${uid}`;
    if (this.registerForm.valid) {
      this.firebaseSvc
        .setDocument(path, this.registerForm.value)
        .then(async (res) => {
          this.firebaseSvc.setDocument(path2, this.registerForm.value);
          this.registerForm.reset();
          this.mostrarAlerta('Se ha creado el empleado con éxito');
        });
    }
  }
  // Función para mostrar una alerta
  mostrarAlerta(mensaje: string) {
    this.toastController
      .create({
        message: mensaje,
        duration: 3000, // Duración de la alerta en milisegundos
      })
      .then((toast) => {
        toast.present();
      });
  }
  ngOnInit() {}

  loadEmployeeData() {
    this.firestore
      .collection(`Usuarios/${this.user.uid}/Propiedad`)
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          const direccion = doc.direccion;
          this.items.push({
            title: doc.nombre,
            subtitle: doc.direccion,
            content: doc.descripcion,
            monto: doc.monto,
            imageUrl: doc.image,
            imageAlt: doc.image,
            direccion: direccion,
            uid: doc.productoID,
          });
        });
      });
  }
  cargarEmpleado() {
    this.firestore
      .collection(`Usuarios/${this.user.uid}/Empleado`)
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          const direccion = doc.direccion;
          this.empleado.push({
            title: doc.name,
            subtitle: doc.email,
            content: doc.tipoUsuario,
            uid: doc.uid,
          });
        });
      });
  }

  segmentChanged() {
    // Lógica para cambiar entre los segmentos (Registro e Inicio de Sesión)
  }

  ///////////////////////////////////////// DEBO HACER QUE EL UPDATE CAMBIE POR EL  updatedData /////////////////////////////////////
  editarItem(uid: string) {
    this.firestore
      .collection(`Usuarios/${this.user.uid}/Propiedad`)
      .doc(uid)
      .update(this.items)
      .then(() => {
        console.log('Elemento editado con éxito');
      })
      .catch((error) => {
        console.error('Error al editado elemento: ', error);
      });
  }
  eliminarItem(uid: string) {
    this.firestore
      .collection(`Usuarios/${this.user.uid}/Propiedad`)
      .doc(uid)
      .delete()
      .then(() => {
        console.log('Elemento eliminado con éxito');
      })
      .catch((error) => {
        console.error('Error al eliminar elemento: ', error);
      });
  }
  eliminarEmpleado(uid: string) {
    this.firestore
      .collection(`Usuarios/${this.user.uid}/Empleado`)
      .doc(uid)
      .delete()
      .then(() => {
        console.log('Elemento eliminado con éxito');
      })
      .catch((error) => {
        console.error('Error al eliminar elemento: ', error);
      });
  }
  filterItems() {
    if (this.searchTerm.trim() === '') {
      // Si el campo de búsqueda está vacío, muestra todos los elementos.
      this.filteredItems = this.items;
    } else {
      // Si hay un término de búsqueda, filtra los elementos que coinciden con la dirección.
      this.filteredItems = this.items.filter((item) =>
        item.direccion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  addUpdateProduct(uid:string) {
    this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'app-update-modal',
      componentProps: {
        uid_editar: uid  // Pasa el commonID al componente
      }
    });
  }
}
