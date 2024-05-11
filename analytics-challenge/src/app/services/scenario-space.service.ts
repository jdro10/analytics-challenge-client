import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({
    'X-API-Key': 'API_KEY',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ScenarioSpaceService {
  
  constructor(public http: HttpClient) {}

  getScenarioSpace(scenarioSpace: string) {
    return this.http.get<any>(
      'API_URL',
      {
        params: new HttpParams().set('scenarioSpace', scenarioSpace),
        headers: httpOptions.headers,
      }
    );
  }
}
