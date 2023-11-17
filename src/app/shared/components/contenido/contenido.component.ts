import { Component, OnInit, inject, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';


@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss'],
})
export class ContenidoComponent implements OnInit {
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() minDate: string;
  @Input() maxDate: string;
  cards: any[] = [];
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  user: User | null = null;
  showAdminActions = false;
  showLoginActions = true;

  filteredItems: any[] = [];
  searchTerm: string = '';

  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private dataSharingService: DataSharingService
  ) {
    const today = new Date();
    this.minDate = today.toISOString();
    this.startDate = today.toISOString();
    const maxDate = new Date(today.getFullYear(), 12, 30);
    this.maxDate = maxDate.toISOString();
    this.endDate =today.toISOString();
    this.user = this.utilsSvc.getUserFromLocalStorage();
    this.filterItems();

    if (this.user) {
      this.showLoginActions = false;
    }
  
    if (this.user) {
      this.showAdminActions = this.user.tipoUsuario === 'Admin' || this.user.tipoUsuario === 'Empleado';
      if (this.user.tipoUsuario === 'User') {
        this.loadUserData();
      } else if (this.user.tipoUsuario === 'Empleado' || this.user.tipoUsuario === 'Admin' ) {
        this.loadEmployeeData();
      } 
    }
  }
  filterItems() {
    if (this.searchTerm.trim() === '') {
      // Si el campo de búsqueda está vacío, muestra todos los elementos.
      this.filteredItems = this.cards;
    } else {
      // Si hay un término de búsqueda, filtra los elementos que coinciden con la dirección.
      this.filteredItems = this.cards.filter(item => item.comuna.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
  }
  
  getProducts() {
    let path = `Usuarios/${this.user_new().uid}/Propiedad`;
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.cards = res; // Restablece las tarjetas originales
        sub.unsubscribe();
      },
    });
  }
  user_new(): User{
    return this.utilsSvc.getFromLocalStorage('Usuarios');
  }

  calculateSelectedDays(start: string, end: string): number {
    if (start && end) {
      const startDate = new Date(start).getTime();
      const endDate = new Date(end).getTime();
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysSelected = Math.floor((endDate - startDate) / millisecondsPerDay);
      
      return daysSelected + 1;
    }
    
    return 0;
  }
  ngOnInit(): void {}

  loadUserData() {
    // Obtén datos del usuario desde Firestore
    this.firestore
      .collection('Propiedad')
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          const direccion = doc.direccion;
          this.cards.push({
            title: doc.nombre,
            subtitle: doc.direccion,
            content: doc.descripcion,
            monto: doc.monto,
            comuna: doc.comuna,
            imageUrl: doc.image,
            imageAlt: doc.image,
            direccion: direccion,
          });
        });
      });
  }

  loadEmployeeData() {
    this.firestore
      .collection('Propiedad')
      .valueChanges()
      .subscribe((data: any[]) => {
        data.forEach((doc) => {
          const direccion = doc.direccion;
          this.cards.push({
            title: doc.nombre,
            subtitle: doc.direccion,
            content: doc.descripcion,
            monto: doc.monto,
            comuna: doc.comuna,
            imageUrl: doc.image,
            imageAlt: doc.image,
            direccion: direccion,
          });
        });
      });
  }

  loadAdminData() {
    // Puedes implementar una función similar para cargar datos de Firestore para administradores.
  }

  handleCardClick(direccion: string) {
    this.dataSharingService.setDates(this.startDate, this.endDate);
    this.navCtrl.navigateForward(['/reserva', direccion]);
  }

  irCheckInPage(event: Event, direccion: string) {
    event.stopPropagation();
    this.navCtrl.navigateForward(['/check-in', direccion]);
  }

  irCheckOutPage(event: Event, direccion: string) {
    event.stopPropagation();
    this.navCtrl.navigateForward(['/check-out', direccion]);
  }
  onClick(){
    this.navCtrl.navigateForward('/tabs/tab4/iniciar-sesion')
  }
}
