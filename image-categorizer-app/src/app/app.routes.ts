import { Routes } from '@angular/router';
import { ImageFeedbackComponent } from './image-feedback/image-feedback.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';

export const routes: Routes = [
  { path: 'image-upload', component: ImageUploadComponent },
  { path: 'image-feedback', component: ImageFeedbackComponent },
  { path: '', redirectTo: '/image-upload', pathMatch: 'full' },
];
