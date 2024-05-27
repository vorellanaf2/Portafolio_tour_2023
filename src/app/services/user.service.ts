// user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject: BehaviorSubject< User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  setUser(user: User | null) {
    this.userSubject.next(user);
  }
  clearUser(): void {
    this.userSubject.next(null);
  }
}
