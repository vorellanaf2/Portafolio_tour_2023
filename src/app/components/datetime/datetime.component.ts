import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
})
export class DatetimeComponent  {
  startDate: string;
  endDate: string;
  minDate: string;
  maxDate: string;
  constructor() {
    // Obtiene la fecha actual
    const today = new Date();
    
    // Convierte la fecha actual a formato ISO (YYYY-MM-DD)
    this.minDate = today.toISOString();
    this.startDate = today.toISOString();
    // Define la fecha máxima 
    const maxDate = new Date(today.getFullYear(), 12, 30);
    this.maxDate = maxDate.toISOString();
    this.endDate =today.toISOString();
  }
  onClick(){
    
  }

  calculateSelectedDays() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).getTime(); // Convierte a milisegundos
      const end = new Date(this.endDate).getTime(); // Convierte a milisegundos
      const millisecondsPerDay = 24 * 60 * 60 * 1000; // Milisegundos en un día
      const daysSelected = Math.floor((end - start) / millisecondsPerDay);
      if (daysSelected <0) {
        daysSelected==0;
      }return daysSelected + 1;
       // Suma 1 para incluir la fecha de inicio en el cálculo
    }
    return 0; // Si alguna de las fechas es nula, el resultado es 0 días seleccionados
  }
  
}
