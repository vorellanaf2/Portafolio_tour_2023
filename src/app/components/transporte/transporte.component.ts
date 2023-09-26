import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.scss'],
})
export class TransporteComponent{
  selectedSegment: string = 'departamento';
  propertyForm: FormGroup;
  productForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      utensilio_cuchillo:['',Validators.required],
      utensilio_cucharas:['',Validators.required],
      utensilio_tenedor:['',Validators.required],
      vasos:['',Validators.required],
      tazas:['',Validators.required],
      platos:['',Validators.required],
      camas:['',Validators.required],
      refrigerador:[false],
      microondas:[false],
      television:[false],
      sillon:[false],
      ollas:[false],
      comedor:[false],
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
      descripcion: ['',Validators.required],
      wifi: [false],
      patio: [false],
      terraza: [false],
      agua: [false],
      electricidad: [false],
    });
  }
  formulariosCompletos(): boolean {
    if (this.selectedSegment === 'departamento') {
      return this.propertyForm.valid;
    } else if (this.selectedSegment === 'producto') {
      return this.productForm.valid;
    }
    return false;
  }
  guardar() {
    if (this.formulariosCompletos()) {
      // Realizar acciones para guardar los datos
      if (this.selectedSegment === 'departamento') {
        // Guardar datos del formulario de departamento
        console.log(this.propertyForm.value);
      } else if (this.selectedSegment === 'producto') {
        // Guardar datos del formulario de producto
        console.log(this.productForm.value);
      }

      // Puedes reiniciar los formularios o realizar otras acciones aquí
    } else {
      // El formulario no es válido, muestra errores o mensajes
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.propertyForm.valid) {
      // Realizar acciones con los datos del formulario
      console.log(this.propertyForm.value);
    } else {
      // El formulario no es válido, mostrar errores o mensajes
    }
  }
}