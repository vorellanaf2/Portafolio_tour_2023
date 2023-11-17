import { Component, inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  utilsSvc = inject(UtilsService);
  user: User | null = null;
  showTab4 = false;

  constructor() {
    this.user = this.utilsSvc.getUserFromLocalStorage();
    if (this.user && this.user.tipoUsuario === 'Admin') {
      this.showTab4 = true;
    }
  }
}
