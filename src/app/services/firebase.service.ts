import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { getFirestore, setDoc, doc,getDoc, addDoc, collection} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth2 = inject(AngularFireAuth);
  firestore2 = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  private propiedadData: any;
  private productoData: any;
  private reservaData: any;
  private userData: any;

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser,{displayName});
  }
  getAuth() {
    return getAuth();
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }
  signOut() {
    getAuth().signOut();  
    localStorage.removeItem('Usuarios');
    this.utilsSvc.routerLink('/tabs/tab4/iniciar-sesion');
  }
  
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path:string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }


  addDocument() {

  }

  constructor(private firestore: AngularFirestore) {}

  setUserData(data: any) {
    this.userData = data;
  }
  getUserData() {
    return this.userData;
  }

  setPropiedadData(data: any) {
    this.propiedadData = data;
  }

  getPropiedadData() {
    return this.propiedadData;
  }

  setProductoData(data: any) {
    this.productoData = data;
  }
  getProductoData() {
    return this.productoData;
  }
}
