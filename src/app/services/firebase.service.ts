import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile,sendPasswordResetEmail,signOut,
} from 'firebase/auth';
import {getFirestore,setDoc,doc,getDoc,addDoc,collection, collectionData, query} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage';



@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth2 = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = getStorage();
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
    return updateProfile(getAuth().currentUser, {displayName});
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

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref,collectionQuery),{idField: 'id'})
  }

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(),path),data_url,'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(),path))
    })
  }

  constructor(private firestore2: AngularFirestore) {}

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
