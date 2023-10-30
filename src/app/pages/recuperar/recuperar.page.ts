import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  loginForm: FormGroup;
  firebaseSvc = inject(FirebaseService);

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  async submit() {
    if (this.loginForm.valid) {
      try {
        const email = this.loginForm.value.email;
        await this.firebaseSvc.sendRecoveryEmail(email);
        this.mostrarAlerta('Correo de restablecimiento de contraseña enviado correctamente.');
      } catch (error) {
        this.mostrarAlerta('Error al enviar el correo de restablecimiento de contraseña: ' + error);
      }
    } else {
      this.mostrarAlerta('Ingresa un correo electrónico válido.');
    }
  }

  async mostrarAlerta(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
    });
    toast.present();
  }
}
