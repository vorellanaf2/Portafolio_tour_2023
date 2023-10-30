import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-carga-imagenes',
  templateUrl: './carga-imagenes.component.html',
  styleUrls: ['./carga-imagenes.component.scss'],
})
export class CargaImagenesComponent {
  selectedFile: File | null = null;
  uploadProgress: number | undefined;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (!this.selectedFile) {
      console.error('No se seleccionó ninguna imagen.');
      return;
    }

    const filePath = `imagenes/${Date.now()}_${this.selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.put(this.selectedFile);

    task.percentageChanges().subscribe((percentage) => {
      this.uploadProgress = percentage;
    });

    task.then((uploadTaskSnapshot) => {
      console.log('Imagen subida con éxito.');
      fileRef.getDownloadURL().subscribe((imageUrl) => {
        this.firestore.collection('Propiedad').add({ imageUrl }).then(() => {
          console.log('Imagen asociada a la colección con éxito.');
        }).catch((error) => {
          console.error('Error al asociar la imagen a la colección:', error);
        });
      });
    }).catch((error) => {
      console.error('Error al subir la imagen:', error);
    });
  }
}