import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController, IonRefresher, AlertController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss'],
})
export class ContenidoComponent {
  @ViewChild(IonRefresher) ionRefresher: IonRefresher;
  startDate: string;
  endDate: string;
  minDate: string;
  maxDate: string;
  cards: any[] = [];
  filteredItems: any[] = [];
  searchTerm: string = '';
  user: User | null = null;


  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private dataSharingService: DataSharingService,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private alertController: AlertController
  ) {
    const today = new Date();
    this.minDate = today.toISOString();
    this.startDate = today.toISOString();
    this.maxDate = new Date(today.getFullYear(), 12, 30).toISOString();
    this.endDate = today.toISOString();
    this.user = this.utilsSvc.getUserFromLocalStorage();
    this.loadData();
  }

  async loadData() {
    this.cards = [];

    if (this.user) {
      await this.filterItems();
    }

    const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    this.cards = this.cards.filter(card => card.fechaReserva !== today);

    console.log('Cards after loading data:', this.cards);
    this.filterItems();

    if (this.ionRefresher) {
      this.ionRefresher.complete();
    }
  }

  async doRefresh(event: any) {
    await this.filterItems();
    await this.loadData();
    await this.loadEmployeeData();
    event.target.complete();
  }

  filterItems() {
    this.filteredItems = this.searchTerm.trim() === ''
      ? this.cards
      : this.cards.filter(item => item.comuna.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  ionViewWillEnter() {

    this.loadEmployeeData();
  }

  getProducts() {
    const path = `Usuarios/${this.user_new().uid}/Propiedad`;
    const sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.cards = res;
        sub.unsubscribe();
      },
    });
  }

  user_new(): User {
    return this.utilsSvc.getFromLocalStorage('Usuarios');
  }

  calculateSelectedDays(start: string, end: string): number {
    if (start && end) {
      const startDate = new Date(start).getTime();
      const endDate = new Date(end).getTime();
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      return Math.floor((endDate - startDate) / millisecondsPerDay) + 1;
    }
    return 0;
  }

  loadUserData() {
    this.loadPropertyData();
  }

  loadEmployeeData() {
    this.loadPropertyData();
  }

  loadPropertyData() {
    this.firestore.collection('Propiedad').valueChanges().subscribe((data: any[]) => {
      this.cards = data.map(doc => ({
        title: doc.nombre,
        subtitle: doc.direccion,
        content: doc.descripcion,
        monto: doc.monto,
        comuna: doc.comuna,
        imageUrl: doc.image,
        imageAlt: doc.image,
        direccion: doc.direccion,
      }));
      this.filterItems();
    });
  }

  async handleCardClick(direccion: string) {
    if (!this.user) {
      await this.presentLoginAlert();
      return;
    }

    this.dataSharingService.setDates(this.startDate, this.endDate);
    this.navCtrl.navigateForward(['/reserva', direccion]);
  }

  async presentLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Iniciar Sesión',
      message: 'Debes iniciar sesión para continuar.',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Iniciar Sesión',
          handler: () => this.navCtrl.navigateForward('/tabs/tab4/iniciar-sesion'),
        },
      ],
    });
    await alert.present();
  }

  onClick() {
    this.navCtrl.navigateForward('/tabs/tab4/iniciar-sesion');
  }
}
