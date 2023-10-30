import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage {
  segmentModel = 'register';
  registerForm: FormGroup;
  loginForm: FormGroup;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private userService: FirebaseService
  ) {
    // Formulario de Registro
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
      telefono: ['+569', [Validators.required, Validators.minLength(10)]],
      tipoUsuario: ['User'],
    });

    // Formulario de Inicio de Sesión
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  //////////////////////////////////////////// OTRA FUNCION REGISTER /////////////////////////////////////////
  register2() {
    if (this.registerForm.valid) {
      this.firebaseSvc
        .signUp(this.registerForm.value)
        .then(async (res) => {
          await this.firebaseSvc.updateUser(this.registerForm.value.username);
          const user = res.user.uid;
          this.firestore
            .collection('Usuarios')
            .doc(user)
            .set(this.registerForm.value);
          console.log('Usuario registrado:', res.user);
          this.userService.setUserData(this.registerForm.value);
          this.setUserInfo(user)
        })
        .catch((error) => {
          this.mostrarAlerta('Error al registrar el usuario: ' + error.message);
          console.log(error)
        });
    } else {
      this.mostrarAlerta('Completa todos los campos antes de registrar.');
    }
  }
  //////////////////////////////////////////// FUNCION SETUSERINFO /////////////////////////////////////////
  setUserInfo(uid: string) {
    let path = `Usuarios/${uid}`;
    if (this.registerForm.valid) {
      this.firebaseSvc.setDocument(path, this.registerForm.value).then(async (res) => {
          this.utilsSvc.saveInlocalStorage('Usuarios', this.registerForm.value);
          this.registerForm.reset
          this.utilsSvc.routerLink('/tabs/tab4/perfil')
          console.log(res)
        });
    }
  }
    //////////////////////////////////////////// FUNCION GETUSERINFO /////////////////////////////////////////
    getUserInfo(uid: string) {
      let path = `Usuarios/${uid}`;
      if (this.loginForm.valid) {
        this.firebaseSvc.getDocument(path).then((user: User) => {
            this.utilsSvc.saveInlocalStorage('Usuarios', user);
            this.mostrarAlerta(`Bienvenido ${user.username}`  );
            this.loginForm.reset
            this.utilsSvc.routerLink('/tabs/tab4/perfil')
            console.log(user)
          });
      }
    }
  /////////////////////////////////////////// OTRA FUNCION LOGIN /////////////////////////////////////////////
  login2() {
    if (this.loginForm.valid) {
      this.firebaseSvc
        .signIn(this.loginForm.value as User)
        .then((res) => {
          this.getUserInfo(res.user.uid);
        })
        .catch((error) => {
          this.mostrarAlerta('Error al iniciar sesión: ' + error.message);
        });
    }
  }
  recuperarContra() {
    this.router.navigate(['../recuperar']),
      {
        relativeTo: this.activatedRoute,
      };
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
  // Verifica el valor del campo "telefono"
  checkTelefonoValue() {
    const telefonoValue = this.registerForm.get('telefono')?.value;

    // Define el umbral o límite superior
    const umbral = 1000000000; // Cambia esto según tus necesidades

    if (telefonoValue > umbral) {
      this.mostrarAlerta('El valor es de 9 numeros');
    }
  }
  segmentChanged() {
    // Lógica para cambiar entre los segmentos (Registro e Inicio de Sesión)
  }
}
