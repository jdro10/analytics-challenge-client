import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  apiUrl: string = environment.customApi;

  constructor(public http: HttpClient) {}

  performSimulation(assetsData: { [key: string]: number }) {
    return this.http.post<any>(`${this.apiUrl}/simulation`, assetsData);
  }
}
