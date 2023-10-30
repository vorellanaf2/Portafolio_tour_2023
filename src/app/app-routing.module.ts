import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';


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
    path: 'iniciar-sesion',
    loadChildren: () => import('./tab4/iniciar-sesion/iniciar-sesion.module').then( m => m.IniciarSesionPageModule),canActivate:[NoAuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./tab4/iniciar-sesion/perfil/perfil.module').then( m => m.PerfilPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
