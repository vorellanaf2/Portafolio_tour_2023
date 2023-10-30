import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})
export class CheckOutPage implements OnInit {
  observacion: string = '';
  direccion: string;
  propiedadData: any = {
    agua: false,
    electricidad: false,
    patio: false,
    terraza: false,
    wifi: false,
  };
  productoData: any = {
    tazas: 0,
    utensilio_cucharas: 0,
    utensilio_cuchillo: 0,
    utensilio_tenedor: 0,
    vasos: 0,
    platos: 0,
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
    { nombre: 'Agua', propiedad: 'agua' },
    { nombre: 'Electricidad', propiedad: 'electricidad' },
    { nombre: 'Patio', propiedad: 'patio' },
    { nombre: 'Terraza', propiedad: 'terraza' },
    { nombre: 'Wifi', propiedad: 'wifi' },
  ];
  opciones: string[] = ['Camas', 'Comedor', 'Sillon', 'Ollas', 'Refrigerador', 'Television', 'Microondas'];
  selectedValues: { [opcion: string]: string } = {};

  setSelected(opcion: string, valor: string) {
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
          console.log('No se encontraron datos de producto para la dirección:', this.direccion);
        }
      });
  }

  onClick() {
    const checkOutData = {
      direccion: this.direccion,
      propiedadData: this.propiedadData,
      productoData: this.productoData,
      observacion: this.observacion,
      monto:0,
    };
    if (this.sonDatosDiferentes(this.propiedadData, this.productoData)) {
      checkOutData.monto = 5000; // Agregar campo de monto
      this.almacenarEnCobroAdicional(checkOutData);
      this.almacenarEnCheckOut(checkOutData);
    } else {
      
    }
  }
  

  sonDatosDiferentes(checkInData:any, checkOutData:any): boolean {
    const propsCheckIn = Object.getOwnPropertyNames(checkInData);
    const propsCheckOut = Object.getOwnPropertyNames(checkOutData);
    if (propsCheckIn.length !== propsCheckOut.length) {
      return true;
    }
    for (const prop of propsCheckIn) {
      if (checkInData[prop] !== checkOutData[prop]) {
        return true; 
      }
    }
    return false;
  }

  almacenarEnCheckOut(checkOutData: any) {
    this.firestore
      .collection('Check-Out')
      .add(checkOutData)
      .then(() => {
        console.log('Datos de check-out guardados correctamente');
        this.presentSuccessAlert();
      })
      .catch((error) => {
        console.error('Error al guardar datos de check-out:', error);
      });
  }

  almacenarEnCobroAdicional(checkOutData: any) {
    this.firestore
      .collection('Servicio_extra')
      .add(checkOutData)
      .then(() => {
        console.log('Datos de cobro adicional guardados correctamente');
        this.presentCobroAdicionalAlert();
      })
      .catch((error) => {
        console.error('Error al guardar datos de cobro adicional:', error);
      });
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Tourismo',
      message: 'Check-Out realizado con éxito.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward('');
          },
        },
      ],
    });

    await alert.present();
  }

  async presentCobroAdicionalAlert() {
    const alert = await this.alertController.create({
      header: 'Tourismo',
      message: 'Se ha realizado un cobro adicional.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward('');
          },
        },
      ],
    });

    await alert.present();
  }
}
