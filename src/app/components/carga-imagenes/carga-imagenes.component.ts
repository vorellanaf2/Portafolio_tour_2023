import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-carga-imagenes',
  templateUrl: './carga-imagenes.component.html',
  styleUrls: ['./carga-imagenes.component.scss'],
})
export class CargaImagenesComponent {
  @Output() imageSelected: EventEmitter<File[]> = new EventEmitter<File[]>();
  isDropZoneValid: boolean = false;
  imageFiles: File[] = [];
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const files: File[] = Array.from(inputElement.files); // Convertir la lista de archivos en un arreglo
      this.imageFiles = files; // Actualizar la lista de archivos
      this.isDropZoneValid = true;
      this.imageSelected.emit(files); // Emitir el arreglo de archivos
    }
  }
  onFileDropped(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.imageFiles = Array.from(files); // Convertir la lista de archivos en un arreglo
      this.isDropZoneValid = true;
      this.imageSelected.emit(this.imageFiles);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Agrega lógica para resaltar la zona de soltar si es necesario
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Agrega lógica para quitar el resaltado si es necesario
  }

  onDragEnd(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Agrega lógica si es necesario cuando finaliza el arrastre
  }

  clearImages() {
    this.imageFiles = [];
    this.isDropZoneValid = false;
    this.imageSelected.emit([]); // Emitir un arreglo vacío para indicar que se eliminaron todas las imágenes
  }

  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }
}
