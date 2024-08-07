import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

interface IDbUser {
  id: number;
  name: string;
  password: string;
  papelId: number;
}

interface IDbRole {
  id : number;
  name: string; 
}

export interface IUser {
  id: number;
  name: string;
  role: IDbRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUsersUrl = 'http://localhost:3000/usuario';
  private apiRolesUrl = 'http://localhost:3000/papel';

  constructor(private http: HttpClient) {}

  signIn(username: string, password: string): Observable<IUser | null> {
    return this.findUser(username, password).pipe(
      switchMap((user) => (user ? this.fetchUserRole(user) : of(null))),
      catchError((error) => {
        console.error('Error during sign-in process:', error);
        return of(null);
      })
    );
  }

  private findUser(
    username: string,
    password: string
  ): Observable<IDbUser | null> {
    return this.http.get<IDbUser[]>(this.apiUsersUrl).pipe(
      map(
        (users) =>
          users.find(
            (user) => user.name === username && user.password === password
          ) || null
      ),
      catchError(() => of(null))
    );
  }

  private fetchUserRole(user: IDbUser): Observable<IUser> {
    return this.http.get<IDbRole[]>(this.apiRolesUrl).pipe(
      map((roles) => roles.find((role) => Number(role.id) === Number(user.papelId))),
      map((role) => ({
        id: user.id,
        name: user.name,
        role: role || { id: 0, name: 'Unknown' },
      }))
    );
  }
}