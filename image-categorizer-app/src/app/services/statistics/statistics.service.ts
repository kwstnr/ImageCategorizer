import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fetchAuthSession } from 'aws-amplify/auth';
import { firstValueFrom } from 'rxjs';
import { StatisticsResponse } from '../../model/statistics-response.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl =
    'https://cc6fj90h7d.execute-api.us-east-1.amazonaws.com/v1/statistics';

  constructor(private _http: HttpClient) {}

  getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async getStatistics(): Promise<StatisticsResponse | null> {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: token,
      });

      return firstValueFrom(
        this._http.post<StatisticsResponse>(
          this.apiUrl,
          { user: session.userSub },
          { headers }
        )
      );
    }
    return null;
  }
}
