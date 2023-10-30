import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userData: any;
  firebaseSvc= inject(FirebaseService);

  constructor(private userService: FirebaseService,    private activatedRoute: ActivatedRoute,
    private router: Router,) { }

  ngOnInit() {
  
    
  }
  //========== CERRAR SESION ===========
  signOut(){
    this.firebaseSvc.signOut();
  }


}
