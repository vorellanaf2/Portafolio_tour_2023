// data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private tab1DataSubject = new BehaviorSubject<any>(null);
  tab1Data$ = this.tab1DataSubject.asObservable();

  updateTab1Data(data: any) {
    this.tab1DataSubject.next(data);
  }
}
