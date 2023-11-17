// data-sharing.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  private startDateSubject = new BehaviorSubject<string>('');
  private endDateSubject = new BehaviorSubject<string>('');
  private selectedDaysSubject = new BehaviorSubject<number>(0);

  startDate$ = this.startDateSubject.asObservable();
  endDate$ = this.endDateSubject.asObservable();
  selectedDays$ = this.selectedDaysSubject.asObservable();

  setDates(startDate: string, endDate: string) {
    this.startDateSubject.next(startDate);
    this.endDateSubject.next(endDate);

    // Calcula los días y actualiza el servicio
    const selectedDays = this.calculateSelectedDays(startDate, endDate);
    this.selectedDaysSubject.next(selectedDays);
  }
  

  private calculateSelectedDays(startDate: string, endDate: string): number {
    // Implementa la lógica de cálculo de días aquí
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysSelected = Math.floor((end - start) / millisecondsPerDay);
      return daysSelected + 1;
    }
    return 0;
  }
}
