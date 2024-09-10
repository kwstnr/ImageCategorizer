import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { from, Observable } from 'rxjs';
import { StatisticsResponse } from '../model/statistics-response.model';
import { StatisticsService } from '../services/statistics/statistics.service';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatProgressSpinnerModule,
    MatGridListModule
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  private _statisticsService = inject(StatisticsService);

  statistics$: Observable<StatisticsResponse | null> = from(
    this._statisticsService.getStatistics()
  );
}
