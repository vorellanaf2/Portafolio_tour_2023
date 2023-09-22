import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular'; 

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.scss'],
})
export class IniciarSesionComponent {
  segmentModel = 'register'; // Establecemos el segmento de registro como predeterminado
  registerForm: FormGroup;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private toastController: ToastController) {
    // Formulario de Registro
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['',[Validators.required,Validators.email]],
      telefono: ['',[Validators.required,Validators.pattern('^[0-9]*$')]]
    });

    // Formulario de Inicio de Sesión
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  register() {
    // Verifica si this.registerForm está definido antes de acceder a sus propiedades
    if (this.registerForm) {
      const username = this.registerForm.get('username')?.value;
      const password = this.registerForm.get('password')?.value;
      const email = this.registerForm.get('email')?.value;
      
      if (!username || !password || !email) {
        // Al menos uno de los campos está vacío, muestra un mensaje de error
        console.error('Error: Completa todos los campos antes de registrar.');
      } else {
        // Realiza el registro del usuario aquí
        console.log('Usuario registrado:', username);
      }
    } else {
      console.error('Error: this.registerForm no está definido.');
    }
    
  }
  

  // Función de Inicio de Sesión
  login() {
    // Verifica si this.loginForm está definido antes de acceder a sus propiedades
    if (this.loginForm) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
  
      if (username !== null && password !== null) {
        // Realiza el inicio de sesión del usuario aquí
        console.error('Error: Nombre de usuario o contraseña nulos.');
        
      } else {
        console.log('Usuario inició sesión:', username);
      }
    } else {
      console.error('Error: this.loginForm no está definido.');
    }
  }
  // Verifica el valor del campo "telefono"
checkTelefonoValue() {
  const telefonoValue = this.registerForm.get('telefono')?.value

  // Define el umbral o límite superior
  const umbral = 1000000000; // Cambia esto según tus necesidades

  if (telefonoValue > umbral) {
    this.mostrarAlerta("El valor es de 9 numeros");
  }
}

// Función para mostrar la alerta
mostrarAlerta(mensaje: string) {
  // Aquí puedes utilizar la función de alerta de Ionic o cualquier otro mecanismo de notificación que prefieras
  // Por ejemplo, utilizando un toast:
  this.toastController.create({
    message: mensaje,
    duration: 3000, // Duración de la alerta en milisegundos
  }).then((toast) => {
    toast.present();
  });
}
  // Cambiar entre Registro e Inicio de Sesión
  segmentChanged() {
    // Lógica para cambiar entre los segmentos (Registro e Inicio de Sesión)
  }
}
