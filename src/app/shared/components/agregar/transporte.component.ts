import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { v4 as uuidv4 } from 'uuid';
import { inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

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
  firebaseSvc = inject(FirebaseService);
  user = {} as User;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private datosCompartidos: FirebaseService
  ) {
    this.user = this.utilsSvc.getUserFromLocalStorage();
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
      disponible: [true],
      imageLink: [''],
    });
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto'))
      .dataUrl;
    this.propertyForm.controls['image'].setValue(dataUrl);
  }

  onSubmit() {
    if (this.selectedSegment === 'departamento') {
      this.guardarDepartamento(this.propertyForm.value);
    } else if (this.selectedSegment === 'producto') {
      this.guardarProducto(this.productForm.value);
    }
  }

  guardar() {
    if (this.user && this.formulariosCompletos()) {
      let dataUrl = this.propertyForm.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;

      this.firebaseSvc
        .uploadImage(imagePath, dataUrl)
        .then((imageUrl) => {
          let imageLink = imageUrl;
          this.propertyForm.controls['image'].setValue(imageLink);

          let path = `Usuarios/${this.user.uid}/Propiedad`;
          let commonID = this.commonID;
          let propertyData = this.propertyForm.value;
          let productData = this.productForm.value;
          let monto = propertyData.monto;
          let montoReserva = Math.round(monto / 2);
          let disponible = propertyData.disponible;

          // Agrega el campo 'imageLink' a los datos de la propiedad
          propertyData.imageLink = imageLink;

          this.guardarConID(path, commonID, propertyData);
          this.guardarConID('Propiedad', commonID, propertyData);
          this.guardarConID('Producto', commonID, productData);          
          this.propertyForm.reset();
          this.productForm.reset();
        })
        .catch((error) => {
          console.error('Error al cargar la imagen:', error);
        });
    } else {
      console.log(
        'Por favor, complete todos los campos antes de guardar o inicie sesión.'
      );
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
        console.error(
          `Error al guardar los datos en ${coleccion} en Firebase:`,
          error
        );
      });
  }

  formulariosCompletos(): boolean {
    return this.propertyForm.valid && this.productForm.valid;
  }

  guardarDepartamento(data: any) {
    if (this.user) {
      const path = `Usuarios/${this.user.name}/Propiedad`;
      data.userEmail = this.user.email;
      this.firestore
        .collection(path)
        .add(data)
        .then((docRef) => {
          const nuevaID = docRef.id;
          console.log(
            'Datos del departamento guardados en Firebase con éxito.',
            nuevaID
          );
        })
        .catch((error) => {
          console.error(
            'Error al guardar los datos del departamento en Firebase:',
            error
          );
        });
      this.datosCompartidos.setPropiedadData(data);
    }
  }

  guardarProducto(data: any) {
    this.firestore
      .collection('Producto')
      .add(data)
      .then((docRef) => {
        const nuevaID = docRef.id;
        console.log(
          'Datos del producto guardados en Firebase con éxito.',
          nuevaID
        );
      })
      .catch((error) => {
        console.error(
          'Error al guardar los datos del producto en Firebase:',
          error
        );
      });

    this.datosCompartidos.setProductoData(data);
  }
}
