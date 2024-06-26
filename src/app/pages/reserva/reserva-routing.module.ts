import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservaPage } from './reserva.page';

const routes: Routes = [
  {
    path: '',
    component: ReservaPage
  },
  {
    path: 'pago',
    loadChildren: () => import('./pago/pago.module').then( m => m.PagoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservaPageRoutingModule {}
