import { Component, inject,OnInit,ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';



@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit{
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
    private userService: UserService,
    private dataService: DataService
  ) {
    // Formulario de Registro
    this.registerForm = this.formBuilder.group({
      uid: [''],
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''],
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
      this.firebaseSvc.signUp(this.registerForm.value as User).then(async (res) => {
          await this.firebaseSvc.updateUser(this.registerForm.value.name);
          let uid = res.user.uid;
          let tipoUsuario = 'User';
          this.registerForm.controls['uid'].setValue(uid);
          this.registerForm.controls['tipoUsuario'].setValue(tipoUsuario)
          this.setUserInfo(uid);
          this.userService.setUser(this.registerForm.value as User);
        })
        .catch((error) => {
          this.mostrarAlerta('Error al registrar el usuario: ' + error.message);
          console.log(error);
        });
    } else {
      this.mostrarAlerta('Completa todos los campos antes de registrar.');
    }
    //this.recargarPagina();
  }

  //////////////////////////////////////////// FUNCION SETUSERINFO /////////////////////////////////////////
  setUserInfo(uid: string) {
    let path = `Usuarios/${uid}`;
    if (this.registerForm.valid) {
      this.firebaseSvc.setDocument(path, this.registerForm.value).then(async (res) => {
          this.utilsSvc.saveInlocalStorage('Usuarios', this.registerForm.value);
          this.utilsSvc.routerLink('/tabs/tab4/perfil');
          this.registerForm.reset();
          console.log('Enrutado con exito');
        });
    }
  }
  recargarPagina() {
    window.location.reload();
  }
    //////////////////////////////////////////// FUNCION GETUSERINFO /////////////////////////////////////////
    getUserInfo(uid: string) {
      let path = `Usuarios/${uid}`;
      if (this.loginForm.valid) {
        this.firebaseSvc.getDocument(path).then((user: User) => {
            this.utilsSvc.saveInlocalStorage('Usuarios', user);
            this.mostrarAlerta(`Bienvenido ${user.name}`  );
            this.utilsSvc.routerLink('/tabs/tab4/perfil');
            this.loginForm.reset();
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
          const userUID = res.user.uid; // Obtén el UID del usuario
          this.getUserInfo(userUID);
          this.userService.setUser(this.loginForm.value as User);
          this.loadTab1Data();
        })
        .catch((error) => {
          this.mostrarAlerta('Error al iniciar sesión: ' + error.message);
        });
    }
    //this.recargarPagina();
  }
  loadTab1Data() {
    const data = {};
    this.dataService.updateTab1Data(data);
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
  ngOnInit(){
  }

  segmentChanged() {
    // Lógica para cambiar entre los segmentos (Registro e Inicio de Sesión)
  }
}
