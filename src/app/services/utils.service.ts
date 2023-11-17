import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  ModalController,
  ModalOptions,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  modelCtrl = inject(ModalController);
  router = inject(Router);

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccion una imagen',
      promptLabelPicture: 'Tome una foto'
    });
  }

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveInlocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  getUserFromLocalStorage(){
    const userData = localStorage.getItem('Usuarios');
    return userData ? JSON.parse(userData) : null;
  }

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modelCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }
  dismissModal(data?: any) {
    return this.modelCtrl.dismiss(data);
  }
}
