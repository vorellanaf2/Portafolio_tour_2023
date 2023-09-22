import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimeComponent } from './datetime/datetime.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BuscarComponent } from './buscar/buscar.component';
import { ContenidoComponent } from './contenido/contenido.component';
import { IniciarSesionComponent } from './iniciar-sesion/iniciar-sesion.component';



@NgModule({
  declarations: [
    DatetimeComponent,
    BuscarComponent,
    ContenidoComponent,
    IniciarSesionComponent
  ],
  exports:[
    DatetimeComponent,
    BuscarComponent,
    ContenidoComponent,
    IniciarSesionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
    
  ]
})
export class ComponentsModule { }
