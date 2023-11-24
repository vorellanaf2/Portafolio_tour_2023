import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { NoAuthGuard } from '../guards/no-auth.guard';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'tab4',
        children: [
          {
            path: '',
            redirectTo: 'iniciar-sesion',
            pathMatch: 'full'
          },
          {
            path: 'iniciar-sesion',
            loadChildren: () => import('../tab4/iniciar-sesion/iniciar-sesion.module').then(m => m.IniciarSesionPageModule),canActivate:[NoAuthGuard]
          },
          {
            path: 'perfil',
            loadChildren: () => import('../tab4/iniciar-sesion/perfil/perfil.module').then(m => m.PerfilPageModule), canActivate:[AuthGuard]
          },
          {
            path: 'recuperar',
            loadChildren: () => import('../pages/recuperar/recuperar.module').then(m => m.RecuperarPageModule)
          } 
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
