import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScenarioSpaceService {
  apiUrl: string = environment.apiUrl;
  apiKey: string = environment.apiKey;

  constructor(public http: HttpClient) {}

  getScenarioSpace(scenarioSpace: string) {
    return this.http.get(`${this.apiUrl}/scenarioSpaceSummary`, {
      params: new HttpParams().set('scenarioSpace', scenarioSpace),
      headers: new HttpHeaders({
        'X-API-Key': this.apiKey,
      }),
    });
  }
}
