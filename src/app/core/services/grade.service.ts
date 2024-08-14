import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IGrade {
  id: number;
  usuarioId: number;
  materiaId: string;
  nota: number;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private readonly apiUrl = 'http://localhost:3000/nota';

  constructor(private http: HttpClient) {}


  getGradesByStudent(studentId: number): Observable<IGrade[]> {
    return this.http.get<IGrade[]>(`${this.apiUrl}?studentId=${studentId}`);
  }

  // Fetch the last 3 grades for a specific student
  getGradesByOrder(studentId: number, order: 'desc' | 'asc' = 'desc', limit: number = 3): Observable<IGrade[]> {
    return this.http.get<IGrade[]>(
      `${this.apiUrl}?studentId=${studentId}&_sort=date&_order=${order}&_limit=${limit}`
    );
  }
}
