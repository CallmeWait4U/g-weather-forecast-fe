import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import * as Notiflix from 'notiflix';
import { catchError, map, retry, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private email: string;
    private url: string = 'https://g-weather-forecast-be-fecs.onrender.com'
    constructor(private httpClient: HttpClient) {
      const email = localStorage.getItem("email")
      this.email = email ? JSON.parse(email) : '';
    }

    signIn(data: {email: string | null, password: string | null}) {
      return this.httpClient.post(`${this.url}/signIn`, data)
      .pipe(
        retry(3),
        catchError(this.handlerError),
        map(this.handlerResponse),
        map((data) => {
          Notiflix.Notify.success('Operation was successful!');
          Notiflix.Loading.remove();
          return data;
        }),
      );
    }

    signUp(data: {email: string | null, password: string | null}) {
      return this.httpClient.post(`${this.url}/signUp`, data)
      .pipe(
        retry(3),
        catchError(this.handlerError),
        map(this.handlerResponse),
        map((data) => {
          Notiflix.Notify.success('Operation was successful!');
          Notiflix.Loading.remove();
          return data;
        }),
      );
    }

    search(name: string) {
      const getEmail = localStorage.getItem("email");
      const email = getEmail ? JSON.parse(getEmail) : undefined;
      return this.httpClient.get(`${this.url}/search`, { params: { name, email: email ? email : '' }})
      .pipe(
        catchError(this.handlerError), 
        map(this.handlerResponse),
        map((data) => {
          Notiflix.Notify.success('Operation was successful!');
          Notiflix.Loading.remove();
          return data;
        }),
      );
    }

    subscribe() {
      return this.httpClient.get(`${this.url}/subscribe`, { params: { email: this.email }})
      .pipe(
        catchError(this.handlerError), 
        map(this.handlerResponse),
        map((data) => {
          Notiflix.Notify.success('Operation was successful!');
          Notiflix.Loading.remove();
          return data;
        }),
      );
    }

    unsubscribe() {
      return this.httpClient.get(`${this.url}/unsubscribe`, { params: { email: this.email }})
      .pipe(
        catchError(this.handlerError), 
        map(this.handlerResponse),
        map((data) => {
          Notiflix.Notify.success('Operation was successful!');
          Notiflix.Loading.remove();
          return data;
        }),
      );
    }
    
    private handlerError(err: HttpErrorResponse) {
      if (err.status === 400 && err.error?.message && err.error?.message.length > 0) {
        Notiflix.Notify.failure(err.error.message.toString());
      } else {
        Notiflix.Notify.failure('Operation failed. Please try again.');
      }
      Notiflix.Loading.remove();
      return throwError(() => err);
    }

    private handlerResponse(resApi: any) {
      return resApi;
    }
}