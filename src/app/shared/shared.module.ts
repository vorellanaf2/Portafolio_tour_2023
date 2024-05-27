import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { AddUpdateProductComponent } from './components/add-update-product/add-update-product.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscarComponent } from '../shared/components/buscar/buscar.component';
import { ContenidoComponent } from '../shared/components/contenido/contenido.component';
import { TransporteComponent } from './components/agregar/transporte.component';
import { CargaImagenesComponent } from '../shared/components/carga-imagenes/carga-imagenes.component';
import { ContenidoVistaComponent } from '../shared/components/contenido-vista/contenido-vista.component';
import { DatetimeComponent } from '../shared/components/datetime/datetime.component';
import { SegmentoAdminComponent } from './components/segmento-admin/segmento-admin.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { CheckComponent } from './components/check/check.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    AddUpdateProductComponent,
    DatetimeComponent,
    BuscarComponent,
    ContenidoComponent,
    TransporteComponent,
    CargaImagenesComponent,
    ContenidoVistaComponent,
    SegmentoAdminComponent,
    ReservasComponent,
    EstadisticasComponent,
    CheckComponent
  ],
  exports:[
    HeaderComponent,
    LogoComponent,
    AddUpdateProductComponent,
    DatetimeComponent,
    BuscarComponent,
    ContenidoComponent,
    TransporteComponent,
    CargaImagenesComponent,
    ContenidoVistaComponent,
    SegmentoAdminComponent,
    ReservasComponent,
    EstadisticasComponent,
    CheckComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
