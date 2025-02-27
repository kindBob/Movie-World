import { inject, Injectable, signal } from '@angular/core';
import { User } from '../entities/user';
import { catchError, EMPTY, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../entities/auth';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  http = inject(HttpClient);
  msgService = inject(MessageService); 
  users:User[] = [new User("JankoService", "janko@janko.sk"),
           new User("MarienkaService", "marienka@janko.sk", 2, new Date('2025-01-01'))
  ];
  url = 'http://localhost:8080/';

  loggedUserS = signal(this.userName);

  set token(value: string) {
    if (value) {
      localStorage.setItem('filmsToken', value);
    } else {
      localStorage.removeItem('filmsToken');
    }
  }

  get token(): string {
    return localStorage.getItem('filmsToken') || '';
  }

  set userName(value: string) {
    if (value) {
      localStorage.setItem('filmsUserName', value);
    } else {
      localStorage.removeItem('filmsUserName');
    }
    this.loggedUserS.set(value);
  }

  get userName(): string {
    return localStorage.getItem('filmsUserName') || '';
  }
  
  getUsersSynchronous():User[] {
    return this.users;
  }

  getLocalUsers():Observable<User[]> {
    return of(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users').pipe(
      map(jsonUsers => jsonUsers.map(jsonUser => User.clone(jsonUser))),
      catchError(err => this.processError(err))
    );
  }
  getExtendedUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users/' + this.token).pipe(
      map(jsonUsers => jsonUsers.map(jsonUser => User.clone(jsonUser))),
      catchError(err => this.processError(err))
    );
  }

  login(auth:Auth): Observable<boolean> {
    return this.http.post(this.url + 'login',auth, {responseType: 'text'}).pipe(
      tap(token => {
        this.token = token;
        this.userName = auth.name;
        
        this.msgService.success("user "+ auth.name +" is logged in");
      }),
      map(token => true),
      catchError(error => this.processError(error))
    );
  }

  logout(): Observable<void> {
    return this.http.get<void>(this.url + 'logout/' + this.token).pipe(
      tap(() => {
        this.msgService.success("User " + this.userName + " is logged out");
        this.userName = '';
        this.token = '';
      }),
      catchError(error => this.processError(error))
    )
  }

  processError(error:any) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.msgService.error('Server not available');
        return EMPTY;
      }
      if (error.status >= 400 && error.status < 500) {
        const message = error.error?.errorMessage ? error.error.errorMessage : JSON.parse(error.error).errorMessage;
        this.msgService.error(message);
        return EMPTY;
      }
      console.error(error);
      this.msgService.error("Server error, please contact administrator");
    } else {
      console.error(error);
      this.msgService.error("Your angular developer did something wrong");
    }
    return EMPTY;
  }
}
