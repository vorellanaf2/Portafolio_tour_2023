import { Component,inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';
import { TransporteComponent } from '../shared/components/agregar/transporte.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  constructor(){
    
  }
  addUpdateProduct(){
    this.utilsSvc.presentModal({
      component: TransporteComponent,
      cssClass: 'app-update-modal'
    })
  }  
  
}
