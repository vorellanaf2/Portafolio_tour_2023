import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
})
export class EstadisticasComponent implements OnInit, OnDestroy, AfterViewInit {
  reservationCards: any[] = [];
  propertyCards_reserva: any[] = [];
  propertyCards: any[] = [];
  selectedSegment: string = 'graph1';
  user = {} as User;
  totalReservas: number;
  numberOfElements: number;
  propertyReservaLengths: { [key: string]: number } = {};
  direccionKeys: string[] = [];
  @ViewChild('barChart') barChart: ElementRef;
  @ViewChild('secondBarChart') secondBarChart: ElementRef;

  // Almacena instancias de los gráficos creados
  barChartInstance: Chart;
  secondBarChartInstance: Chart;

  // Almacena suscripciones
  private subscriptions: Subscription[] = [];

  constructor(
    private firestore: AngularFirestore,
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadPropertyData_reserva();
  }

  ngOnDestroy() {
    // Destruye los gráficos al salir del componente para evitar errores
    if (this.barChartInstance) {
      this.barChartInstance.destroy();
    }

    if (this.secondBarChartInstance) {
      this.secondBarChartInstance.destroy();
    }

    // Desuscribe de todas las suscripciones
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit() {
    // Verifica si el usuario está autenticado antes de crear los gráficos
    this.user = this.utilsSvc.getUserFromLocalStorage();

    if (this.user && this.user.uid) {
      // Intenta reorganizar tus gráficos aquí si es necesario
      this.createBarChart();
      this.createSecondBarChart();
    } else {
      // Si el usuario no está autenticado, podrías redirigirlo a la página de inicio de sesión
      this.navCtrl.navigateRoot(['/tabs/tab4/iniciar-sesion']);
    }
  }

  loadPropertyData_reserva() {
    let path = `Reserva`;
    this.subscriptions.push(
      this.firestore.collection(path).valueChanges().subscribe((data: any[]) => {
        this.propertyCards_reserva = data.map(doc => {
          const totalPorReserva = doc.monto * doc.diasArriendo;
          const costoTransporte = doc.transporte ? 45000 : 0;
          const totalConTransporte = totalPorReserva + costoTransporte;

          return {
            uid: doc.productoID,
            direccion: doc.direccion,
            direccionUser: doc.direccionUser,
            monto: doc.monto,
            fechaInicio: doc.fechaInicio,
            fechaTermino: doc.fechaTermino,
            diasArriendo: doc.diasArriendo,
            transporte: doc.transporte,
            metodoPago: doc.metodoPago,
            total: doc.total,
            totalPorReserva: totalPorReserva,
            totalConTransporte: totalConTransporte,
            estado: doc.estado,
          };
        });

        this.propertyReservaLengths = this.calculateTotalByDirection(this.propertyCards_reserva);
        this.direccionKeys = Object.keys(this.propertyReservaLengths);

        // Llama a la creación de gráficos después de cargar los datos
        this.createBarChart();
        this.createSecondBarChart();
      })
    );
  }

  calculateTotalByDirection(propertyCards: any[]): { [key: string]: number } {
    const totalByDirection: { [key: string]: number } = {};
    propertyCards.forEach(card => {
      const direction = card.direccion;
      totalByDirection[direction] = (totalByDirection[direction] || 0) + card.totalPorReserva;
    });
    return totalByDirection;
  }

  createBarChart() {
    if (this.barChart && this.barChart.nativeElement) {
      // Destruye el gráfico existente si ya está creado
      if (this.barChartInstance) {
        this.barChartInstance.destroy();
      }

      const directions = this.direccionKeys;
      const counts = Object.values(this.propertyReservaLengths);

      this.barChartInstance = new Chart(this.barChart.nativeElement, {
        type: 'bar',
        data: {
          labels: directions,
          datasets: [{
            label: 'Totales por Dirección',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  countDirections(propertyCards: any[]): { [key: string]: number } {
    const directionCount: { [key: string]: number } = {};
    propertyCards.forEach(card => {
      const direction = card.direccion;
      directionCount[direction] = (directionCount[direction] || 0) + 1;
    });
    return directionCount;
  }

  createSecondBarChart() {
    if (this.secondBarChart && this.secondBarChart.nativeElement) {
      // Destruye el gráfico existente si ya está creado
      if (this.secondBarChartInstance) {
        this.secondBarChartInstance.destroy();
      }

      const directions = this.direccionKeys;
      const counts = Object.values(this.countDirections(this.propertyCards_reserva));

      this.secondBarChartInstance = new Chart(this.secondBarChart.nativeElement, {
        type: 'bar',
        data: {
          labels: directions,
          datasets: [{
            label: 'Cantidad de Reservas por Dirección',
            data: counts,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
