import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ImageUploadResponse } from '../model/image-upload-response.model';
import { ImageService } from '../services/image/image.service';

@Component({
  selector: 'app-image-feedback',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent, MatDialogActions],
  templateUrl: './image-feedback.component.html',
  styleUrl: './image-feedback.component.scss',
})
export class ImageFeedbackComponent {
  private readonly _dialogRef = inject(MatDialogRef);
  private readonly _imageService = inject(ImageService);

  readonly data = inject<{
    response: ImageUploadResponse;
    image: string;
  }>(MAT_DIALOG_DATA);

  async sendFeedback(feedback: boolean) {
    await this._imageService.sendFeedback(this.data.response.s3Id, feedback);
    this._dialogRef.close();
  }
}
