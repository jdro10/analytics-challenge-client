import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  apiUrl: string = environment.apiUrl;
  apiKey: string = environment.apiKey;

  constructor(public http: HttpClient) {}

  performSimulation() {
    return this.http.post<any>(`${this.apiUrl}/simulations`, {
      headers: new HttpHeaders({
        'X-API-Key': this.apiKey,
      }),
    });
  }
}
