import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ImageService } from '../services/image/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  private _imageService = inject(ImageService);
  private _router = inject(Router);

  formData: FormData = new FormData();
  fileName?: string;
  base64Image?: string;

  async onFileSelected(event: any, inputFile: File | null) {
    const file: File = inputFile || event.target.files[0];

    if (file) {
      this.fileName = file.name;
      this.formData.append('file', file);
      this.base64Image = await this._imageService.getBase64(file);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];
      this.onFileSelected(event, event.dataTransfer.files[0]);
    }
  }

  clearForm() {
    this.formData = new FormData();
  }

  async uploadFile() {
    const result = await this._imageService.uploadImage(this.base64Image!);

    if (result != null) {
      await this._router.navigate(['/image-feedback'], {
        state: { data: result },
      });
    }
  }
}
