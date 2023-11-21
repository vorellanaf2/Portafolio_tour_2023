import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  cards: any[] = [];
  user: User | null = null;
  items: any[] = [];
  searchTerm: string = '';
  filteredItems: any[] = [];
  empleado: any[] = [];
  propertyForm: FormGroup;
  commonID: string;
  uid: string;

  constructor(
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder,
  ) {
    this.propertyForm = this.formBuilder.group({
      nombre: [''],
      direccion: [''],
      comuna: [''],
      region: [''],
      monto: [null],
      tipoPropiedad: [''],
      habitaciones: [''],
      banos: [''],
      descripcion: [''],
      patio: [''],
      terraza: [''],
      agua: [''],
      electricidad: [''],
      wifi: [''],
    });

    this.user = this.user_new();

    if (this.user) {
      if (
        this.user.tipoUsuario === 'Empleado' ||
        this.user.tipoUsuario === 'Admin'
      ) {
        this.loadEmployeeData();
      }
    }
  }

  user_new(): User {
    return this.utilsSvc.getFromLocalStorage('Usuarios');
  }

  ngOnInit() {}

  onSubmit() {
    // Verificar si el formulario es válido antes de continuar
    if (this.propertyForm.valid) {
      // Obtener los valores del formulario
      const formValues = this.propertyForm.value;
  
      // Asegúrate de que this.commonID tenga un valor válido antes de llamar a update
      if (this.commonID) {
        // Actualizar el documento en la colección 'Propiedad'
        this.firestore
          .collection('Propiedad')
          .doc(this.commonID)
          .update(formValues)
          .then(() => {
            console.log('Elemento en Propiedad editado con éxito');
          })
          .catch((error) => {
            console.error('Error al editar elemento en Propiedad: ', error);
          });
  
        // Actualizar el documento en la subcolección 'Propiedad' del usuario
        this.firestore
          .collection(`Usuarios/${this.user.uid}/Propiedad/`)
          .doc(this.commonID)
          .update(formValues)
          .then(() => {
            console.log('Elemento en la subcolección de Propiedad del usuario editado con éxito');
          })
          .catch((error) => {
            console.error('Error al editar elemento en la subcolección de Propiedad del usuario: ', error);
          });
      } else {
        console.error('No se encontró un ID de documento válido');
      }
    } else {
      console.error('El formulario no es válido');
    }
  }
  

  loadEmployeeData() {
    this.firestore
      .collection(`Usuarios/${this.user.uid}/Propiedad`)
      .valueChanges()
      .subscribe((data: any[]) => {
        this.empleado = data.map((doc) => ({
          nombre: doc.nombre,
          direccion: doc.direccion,
          content: doc.descripcion,
          descripcion: doc.descripcion,
          electricidad: doc.electricidad,
          habitacion: doc.habitaciones,
          patio: doc.patio,
          direccion2: doc.direccion,
          region: doc.region,
          terraza: doc.terraza,
          tipoPropiedad: doc.tipoPropiedad,
          wifi: doc.wifi,
          monto: doc.monto,
          comuna: doc.comuna,
          imageUrl: doc.image,
          imageAlt: doc.image,
          productoID: doc.productoID, // Agregado productoID
        }));

        // Después de cargar los datos, establecer los valores del formulario
        if (this.empleado.length > 0) {
          const firstEmpleado = this.empleado[0];

          // Asignar el valor de productoID a commonID
          this.commonID = firstEmpleado.productoID;

          // Establecer valores del formulario
          this.propertyForm.setValue({
            nombre: firstEmpleado.nombre,
            direccion: firstEmpleado.direccion,
            comuna: firstEmpleado.comuna,
            region: firstEmpleado.region,
            monto: firstEmpleado.monto,
            tipoPropiedad: firstEmpleado.tipoPropiedad,
            habitaciones: firstEmpleado.habitacion,
            banos: '',
            descripcion: firstEmpleado.descripcion,
            patio: firstEmpleado.patio,
            terraza: firstEmpleado.terraza,
            agua: '',
            electricidad: firstEmpleado.electricidad,
            wifi: firstEmpleado.wifi,
          });
        }
      });
  }
}
