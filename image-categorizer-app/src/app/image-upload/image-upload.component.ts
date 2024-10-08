import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, first } from 'rxjs';
import { ImageFeedbackComponent } from '../image-feedback/image-feedback.component';
import { ImageService } from '../services/image/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ImageFeedbackComponent,
    AsyncPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  private _imageService = inject(ImageService);
  private readonly _dialog = inject(MatDialog);

  private readonly _isLoadingSubject = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this._isLoadingSubject.asObservable();

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
      this.onFileSelected(event, event.dataTransfer.files[0]);
    }
  }

  clearForm() {
    this.formData = new FormData();
  }

  async uploadFile() {
    this._isLoadingSubject.next(true);
    const response = await this._imageService.uploadImage(this.base64Image!);
    this._isLoadingSubject.next(false);

    if (response != null) {
      this._dialog
        .open(ImageFeedbackComponent, {
          data: { response, image: this.base64Image },
        })
        .afterClosed()
        .pipe(first())
        .subscribe(() => this.clearForm());
    }
  }
}
