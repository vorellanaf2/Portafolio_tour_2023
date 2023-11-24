import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { User } from 'src/app/models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  user_local: User | null = null;
  showTab2 = false;
  showTab3 = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      this.user_local = user;
      this.updateTabVisibility(user);
    });
  }

  private updateTabVisibility(user: User | null) {
    if (user) {
      console.log('Setting showTab2 and showTab3 based on tipoUsuario:', user.tipoUsuario);
      if (user.tipoUsuario === 'Admin') {
        this.showTab2 = true;
      }
      this.showTab3 = true;
    } else {
      // No hay usuario, oculta los tabs
      this.showTab2 = false;
      this.showTab3 = false;
    }
  }
}
