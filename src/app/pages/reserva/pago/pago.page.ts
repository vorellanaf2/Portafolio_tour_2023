import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  startDate: string;
  commonID: string;
  endDate: string;
  selectedDays: number;
  direccion: string;
  propiedadData: any;
  productoData: any;
  cards: any[] = [];
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  checkboxValue: boolean = false;
  user = {} as User;
  opciones = [
    { nombre: 'Transferencia', imagen: 'transferencia-bancaria-broker.jpg', seleccionada: false },
    { nombre: 'Tarjeta De Debito', imagen: 'redcompra.png', seleccionada: false },
    { nombre: 'Tarjeta De Credito', imagen: 'tarjetas-de-credito-logos-png.webp', seleccionada: false },
  ];
  

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private datosCompartidos: FirebaseService,
    private navCtrl: NavController,
    private dataSharingService: DataSharingService
  ) {
    this.commonID = uuidv4();
    this.direccion = '';
    this.propiedadData = null;
    this.productoData = {};
    this.user = this.utilsSvc.getUserFromLocalStorage();
    
  }
  

  ngOnInit() {
    this.direccion = this.route.snapshot.paramMap.get('direccion');
    this.cargarDatosDesdeFirestore('Propiedad', this.direccion);

    this.dataSharingService.startDate$.subscribe((startDate) => {
      this.startDate = startDate;
    });

    this.dataSharingService.endDate$.subscribe((endDate) => {
      this.endDate = endDate;
    });

    this.dataSharingService.selectedDays$.subscribe((selectedDays) => {
      this.selectedDays = selectedDays;
    });
  }
  formatCurrency(value: number): string {
    // Formatea el número como moneda colombiana
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
  }
  getPrecioTransporte(): string {
    const precioTransporte = this.checkboxValue ? 45000 : 0;
    return precioTransporte.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
  }
  getTotal(): string {
    const precioPorDias = (this.propiedadData.monto && this.selectedDays) ? (this.propiedadData.monto * this.selectedDays) : 0;
    const precioTransporte = this.checkboxValue ? 45000 : 0;
  
    // Asegúrate de convertir los valores a números
    const total = Number(precioPorDias) + Number(precioTransporte);
  
    return total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
  }
  
  guardarConID(coleccion: string, id: string, data: any) {
    this.firestore
      .collection(coleccion)
      .doc(id)
      .set(data)
      .then(() => {
        console.log(`Datos guardados en ${coleccion} en Firebase con éxito.`);
      })
      .catch((error) => {
        console.error(
          `Error al guardar los datos en ${coleccion} en Firebase:`,
          error
        );
      });
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
          console.log('No se encontraron datos para el productoID:', productoID);
        }
      });
  }

  onClick() {
    console.log('Se ha descontado un millon de dolares su compra es gratis');
  }
  isCheckBoxSelected(): boolean {
    return this.opciones.some(opcion => opcion.seleccionada);
  }

  realizarPago() {
    let commonID = this.commonID;
    let path = `Usuarios/${this.user.uid}/Reserva`
    const reservaData = {
      direccion: this.propiedadData.direccion,
      direccionUser: this.user.direccion,
      monto: this.propiedadData.monto,
      fechaInicio: this.startDate,
      comuna: this.propiedadData.comuna,
      region: this.propiedadData.region,
      propiedadID: this.propiedadData.productoID,
      fechaTermino: this.endDate,
      diasArriendo: this.selectedDays,
      transporte: this.checkboxValue,
      metodoPago: this.obtenerMetodoPagoSeleccionado(),
      total: this.getTotal(),
  };
    this.guardarConID('Reserva', commonID, reservaData);
    this.guardarConID(path, commonID, reservaData);
    this.guardarConID(`Usuarios/${this.user.uid}/Propiedad/${this.propiedadData.productoID}/Reserva`, commonID, reservaData);
    this.navCtrl.navigateBack('');

  }
  obtenerMetodoPagoSeleccionado(): string {
    for (const opcion of this.opciones) {
      if (opcion.seleccionada) {
        return opcion.nombre;
      }
    }
    return 'No seleccionado';
  }

  imagenUrl(nombreImagen: string): string {
    return `https://firebasestorage.googleapis.com/v0/b/tourismotest.appspot.com/o/Metodo%20de%20pago%2F${nombreImagen}?alt=media`;
  }

  seleccionarOpcion(opcion) {
    this.opciones.forEach((opt) => (opt.seleccionada = false));
    opcion.seleccionada = true;
  }
}
