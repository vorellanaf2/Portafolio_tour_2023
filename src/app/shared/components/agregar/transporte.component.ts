import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { v4 as uuidv4 } from 'uuid';
import { inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.scss'],
})
export class TransporteComponent {
  selectedSegment: string = 'departamento';
  propertyForm: FormGroup;
  productForm: FormGroup;
  commonID: string;
  utilsSvc = inject(UtilsService);
  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private datosCompartidos: FirebaseService
  ) {
    this.commonID = uuidv4();

    this.productForm = this.formBuilder.group({
      utensilio_cuchillo: ['', Validators.required],
      utensilio_cucharas: ['', Validators.required],
      utensilio_tenedor: ['', Validators.required],
      vasos: ['', Validators.required],
      tazas: ['', Validators.required],
      platos: ['', Validators.required],
      camas: ['', Validators.required],
      refrigerador: [false],
      microondas: [false],
      television: [false],
      sillon: [false],
      ollas: [false],
      comedor: [false],
      productoID: [this.commonID],
    });

    this.propertyForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      comuna: ['', Validators.required],
      region: ['', Validators.required],
      monto: [null, Validators.required],
      tipoPropiedad: ['', Validators.required],
      habitaciones: ['', Validators.required],
      banos: ['', Validators.required],
      image: [''],
      descripcion: ['', Validators.required],
      wifi: [false],
      patio: [false],
      terraza: [false],
      agua: [false],
      electricidad: [false],
      productoID: [this.commonID],
      disponible:[true],
    });
  }
  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl;
    this.propertyForm.controls['image'].setValue(dataUrl)

  }

  onSubmit() {
    if (this.selectedSegment === 'departamento') {
      this.guardarDepartamento(this.propertyForm.value);
    } else if (this.selectedSegment === 'producto') {
      this.guardarProducto(this.productForm.value);
    }
  }
  guardar() {
    if (this.formulariosCompletos()) {
      const commonID = this.commonID;
      const propertyData = this.propertyForm.value;
      const productData = this.productForm.value;
      const monto = propertyData.monto;
      const montoReserva = Math.round(monto / 2);
      const disponible= propertyData.disponible
      this.guardarConID('Propiedad',commonID,propertyData);
      this.guardarConID('Producto',commonID,productData);
      const reservaData ={
        propiedad: propertyData,
        producto: productData,
        fechaInicio:new Date(),
        fechaTermino: new Date(),
        monto: montoReserva,
        disponible: disponible,
      };
      this.guardarConID('Reserva',commonID,reservaData);
      this.propertyForm.reset();
      this.productForm.reset();
    } else {
      console.log('Por favor, complete todos los campos antes de guardar.');
    }
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
        console.error(`Error al guardar los datos en ${coleccion} en Firebase:`, error);
      });
  }
  
  formulariosCompletos(): boolean {
    return this.propertyForm.valid && this.productForm.valid;
  }
  guardarDepartamento(data: any) {
    this.firestore
      .collection('Propiedad')
      .add(data)
      .then((docRef) => {
        const nuevaID = docRef.id;
        console.log('Datos del departamento guardados en Firebase con éxito.', nuevaID);
      })
      .catch((error) => {
        console.error('Error al guardar los datos del departamento en Firebase:', error);
      });
  
    this.datosCompartidos.setPropiedadData(data);
  }
  guardarProducto(data: any) {
    this.firestore
      .collection('Producto')
      .add(data)
      .then((docRef) => {
        const nuevaID = docRef.id;
        console.log('Datos del producto guardados en Firebase con éxito.', nuevaID);
      })
      .catch((error) => {
        console.error('Error al guardar los datos del producto en Firebase:', error);
      });
  
    this.datosCompartidos.setProductoData(data);
  }
}
