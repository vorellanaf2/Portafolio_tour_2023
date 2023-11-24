import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'check-in/:direccion',
    loadChildren: () => import('./pages/check-in/check-in.module').then( m => m.CheckInPageModule)
  },
  {
    path: 'check-out/:direccion',
    loadChildren: () => import('./pages/check-out/check-out.module').then( m => m.CheckOutPageModule)
  },
  {
    path: 'reserva/:direccion',
    loadChildren: () => import('./pages/reserva/reserva.module').then( m => m.ReservaPageModule)
  },  
  {
    path: 'pago/:direccion',
    loadChildren: () => import('./pages/reserva/pago/pago.module').then( m => m.PagoPageModule)
  }, 
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./tab4/iniciar-sesion/iniciar-sesion.module').then( m => m.IniciarSesionPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./tab4/iniciar-sesion/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
