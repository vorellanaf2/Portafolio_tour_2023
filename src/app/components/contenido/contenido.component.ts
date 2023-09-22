import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss'],
})
export class ContenidoComponent  implements OnInit {
  userType: string = 'empleado'; // Esto podría venir de tu autenticación

  // Define las tarjetas de acuerdo al tipo de usuario
  cards: any[] = [];

  constructor() {
    // Dependiendo del tipo de usuario, agrega las tarjetas correspondientes
    if (this.userType === 'user') {
      this.cards.push({
        title: 'Tarjeta para Usuario',
        subtitle: 'Subtítulo de Usuario',
        content: 'Contenido para Usuario',
        imageUrl: 'URL de la imagen para Usuario',
        imageAlt: 'Alt text para Usuario',
      });
    } else if (this.userType === 'empleado') {
      this.cards.push({
        title: 'Tarjeta para Empleado',
        subtitle: 'Subtítulo de Empleado',
        content: 'Contenido para Empleado',
        imageUrl: 'URL de la imagen para Empleado',
        imageAlt: 'Alt text para Empleado',

      });
    } else if (this.userType === 'admin') {
      this.cards.push({
        title: 'Tarjeta para Admin',
        subtitle: 'Subtítulo de Admin',
        content: 'Contenido para Admin',
        imageUrl: 'URL de la imagen para Admin',
        imageAlt: 'Alt text para Admin',
      });
    }
  }

  handleCardClick(card: any) {
    // Lógica cuando se hace clic en una tarjeta, puedes usar el objeto card para obtener detalles adicionales
    console.log('Card clicked:', card);
  }


  ngOnInit() {}

}
