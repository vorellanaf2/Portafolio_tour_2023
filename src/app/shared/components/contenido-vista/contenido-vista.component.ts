import { Component, Input,OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-contenido-vista',
  templateUrl: './contenido-vista.component.html',
  styleUrls: ['./contenido-vista.component.scss'],
})
export class ContenidoVistaComponent implements OnInit {
  elemento: any;

  constructor(private firebaseService: FirebaseService, private afDatabase: AngularFireDatabase,private route: ActivatedRoute) {}

  ngOnInit() {

  }
}
