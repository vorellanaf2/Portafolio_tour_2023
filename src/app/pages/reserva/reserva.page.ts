import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  direccion: string;
  propiedadData: any;
  productoData: any;
  cards: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private datosCompartidos: FirebaseService,
    private navCtrl: NavController,
    private dataSharingService: DataSharingService,
  ) {
    this.direccion = '';
    this.propiedadData = null;
    this.productoData = {};
  }

  ngOnInit() {
    this.direccion = this.route.snapshot.paramMap.get('direccion') || '';
    this.cargarDatosDesdeFirestore('Propiedad', this.direccion);
  }

  cargarDatosDesdeFirestore(coleccion: string, direccion: string) {
    this.firestore
      .collection(coleccion, (ref) => ref.where('direccion', '==', direccion))
      .valueChanges()
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          if (coleccion === 'Propiedad') {
            this.propiedadData = data[0];
            // Verificar si hay un productoID en la propiedad antes de cargar los datos del producto
            if (this.propiedadData.productoID) {
              // Llamar a cargarDatosDeProducto dentro de un nuevo subscribe
              this.cargarDatosDeProducto(this.propiedadData.productoID);
            }
          } else if (coleccion === 'Producto') {
            // Agregar los datos de Producto a productoData
            this.productoData = data[0];
          }
        } else {
          console.log('No se encontraron datos para la dirección:', direccion);
        }
      });
  }

  cargarDatosDeProducto(productoID: string) {
    this.firestore
      .collection('Producto', (ref) => ref.where('productoID', '==', productoID))
      .valueChanges()
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          // Agregar los datos de Producto a productoData
          this.productoData = data[0];
        } else {
          console.log('No se encontraron datos para el productoID:', productoID);
        }
      });
  }
  onClick(direccion: string) {
    this.navCtrl.navigateForward(['/pago',direccion]);
  }
}
