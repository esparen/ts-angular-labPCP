import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IUser {
  id: number;
  name: string;
  papelId: number;
  password: string;
  image?: string;
  age?: number;
  phone?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:3000/usuario';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  addUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user);
  }

  setUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserCount(): Observable<number> {
    return this.getUsers().pipe(map((users) => users.length));
  }
  
  getUsersByRole(papelId: number): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}?papelId=${papelId}`);
  }

  getUserCountByRole(roleId: number): Observable<number> {
    return this.http
      .get<IUser[]>(`${this.apiUrl}?papelId=${roleId}`)
      .pipe(map((users) => users.length));
  }

  searchUsersByName(name: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}?name_like=${name}`);
  }
}
