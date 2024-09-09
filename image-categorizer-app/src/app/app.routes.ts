import { Routes } from '@angular/router';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { StatisticsComponent } from './statistics/statistics.component';

export const routes: Routes = [
  { path: 'image-upload', component: ImageUploadComponent },
  { path: '', redirectTo: '/image-upload', pathMatch: 'full' },
  { path: 'statistics', component: StatisticsComponent },
];
