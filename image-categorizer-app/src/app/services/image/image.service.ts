import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fetchAuthSession } from 'aws-amplify/auth';
import { firstValueFrom } from 'rxjs';
import { ImageUploadResponse } from '../../model/image-upload-response.model';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl =
    'https://cc6fj90h7d.execute-api.us-east-1.amazonaws.com/v1/image';

  constructor(private _http: HttpClient) {}

  getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async uploadImage(imageBase64: string): Promise<ImageUploadResponse | null> {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: token,
      });

      return firstValueFrom(
        this._http.post<ImageUploadResponse>(
          this.apiUrl,
          { image: imageBase64, user: session.userSub },
          { headers }
        )
      );
    }
    return null;
  }

  async sendFeedback(s3Id: string, correct: boolean): Promise<any> {
    const body = {
      correct
    };

    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: token
      });

      return firstValueFrom(
        this._http.put(`${this.apiUrl}/${s3Id}`, body, { headers })
      );
    }
  }
}
