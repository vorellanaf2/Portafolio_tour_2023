import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
})
export class CheckInPage implements OnInit {
  observacion: string = '';
  direccion: string;
  propiedadData: any={
    agua:false,
    electricidad: false,
    patio: false,
    terraza: false,
    wifi: false,};
  productoData: any={
    tazas:0,
    utensilio_cucharas:0,
    utensilio_cuchillo:0,
    utensilio_tenedor:0,
    vasos:0,
    platos:0,
  };
  selectedValue: string = '';
  valores_propiedades: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  productos_propiedades: { nombre: string; propiedad: string; valores: number[] }[] = [
    { nombre: 'Tazas', propiedad: 'tazas', valores: this.valores_propiedades },
    { nombre: 'Cucharas', propiedad: 'utensilio_cucharas', valores: this.valores_propiedades },
    { nombre: 'Cuchillo', propiedad: 'utensilio_cuchillo', valores: this.valores_propiedades },
    { nombre: 'Tenedor', propiedad: 'utensilio_tenedor', valores: this.valores_propiedades },
    { nombre: 'Vasos', propiedad: 'vasos', valores: this.valores_propiedades },
    { nombre: 'Platos', propiedad: 'platos', valores: this.valores_propiedades },
  ];
  propiedades: { nombre: string; propiedad: string }[] = [
    { nombre: 'Agua',propiedad:'agua'},
    { nombre: 'Electricidad', propiedad: 'electricidad' },
    { nombre: 'Patio', propiedad: 'patio' },
    { nombre: 'Terraza', propiedad: 'terraza' },
    { nombre: 'Wifi', propiedad: 'wifi' },
  ];
  opciones: string[] = ['Camas', 'Comedor', 'Sillon', 'Ollas', 'Refrigerador','Television','Microondas'];
  selectedValues: { [opcion: string]: string } = {};
  setSelected(opcion: string,valor: string) {
    this.selectedValues[opcion] = valor;
  }
  setProduct(propiedad: string, event: any) {
    this.productoData[propiedad] = event.detail.checked;

  }
  
  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private alertController: AlertController
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
            if (this.propiedadData.productoID) {
              this.cargarDatosDeProducto(this.propiedadData.productoID);
            }
          } else if (coleccion === 'Producto') {
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
          this.productoData = data[0];
          
        } else {
          
        }
      });
  }
  onClick() {
    const checkData = {
      direccion: this.direccion,
      propiedadData: this.propiedadData,
      productoData: this.productoData,
      observacion: this.observacion,
    };
    
    this.firestore.collection('Check-In').add(checkData)
      .then(() => {
        console.log('Datos de check-in guardados correctamente');
        this.presentSuccessAlert(); // Llama a la función para mostrar la alerta
      })
      .catch((error) => {
        console.error('Error al guardar datos de check-in:', error);
      });
  }
  
  // Función para mostrar la alerta de éxito
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Tourismo',
      message: 'Check-In realizado con éxito.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward(''); 
          }
        }
      ]
    });
  
    await alert.present();
  }
}

