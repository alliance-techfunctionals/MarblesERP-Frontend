import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OpenSourceDataService{
  constructor(private http: HttpClient) { }

  getAuthToken(): Observable<Response> {
    var headers = new HttpHeaders({
      "Accept": "application/json",
      "api-token": environment.apiKey,
      "user-email": environment.userEmail
    })
    return this.http.get<Response>(environment.requestUrl, { headers: headers });
  }
}

export interface Response {
  "auth_token": string;
}

export interface Country {
  id: any;
  name: string,
  // country_short_name: string,
  // country_phone_code: number
}

export interface State {
  id:any,
  name: string,
}

export interface City {
  id:any,
  name: string,
}