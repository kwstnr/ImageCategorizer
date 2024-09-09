import { Component, OnInit, inject } from '@angular/core';
import { StatisticsService } from '../services/statistics/statistics.service';
import { StatisticsResponse } from '../model/statistics-response.model';
import { BehaviorSubject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit {
  private _statisticsService = inject(StatisticsService);
  private readonly _dialog = inject(MatDialog);

  private readonly _isLoadingSubject = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this._isLoadingSubject.asObservable();

  statistics: StatisticsResponse | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.loadStatistics();
  }

  async loadStatistics() {
    this._isLoadingSubject.next(true);
    const response = await this._statisticsService.getStatistics();
    this._isLoadingSubject.next(false);
    this.statistics = response;
  }
}
