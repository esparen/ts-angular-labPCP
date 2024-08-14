import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface IEnrollmentClass {
  id: number;
  name: string;
  teacherId: number; 
  studentIds: number[]; 
  subjectId: number;
  courseId: number;
}


@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:3000/turma'; // Assuming the JSON server is running on port 3000

  constructor(private http: HttpClient) {}

  
  getClasses(): Observable<IEnrollmentClass[]> {
    return this.http.get<IEnrollmentClass[]>(this.apiUrl);
  }

  
  getClassById(id: number): Observable<IEnrollmentClass> {
    return this.http.get<IEnrollmentClass>(`${this.apiUrl}/${id}`);
  }

  
  addClass(newClass: IEnrollmentClass): Observable<IEnrollmentClass> {
    return this.http.post<IEnrollmentClass>(this.apiUrl, newClass);
  }

  
  updateClass(id: number, updatedClass: IEnrollmentClass): Observable<IEnrollmentClass> {
    return this.http.put<IEnrollmentClass>(`${this.apiUrl}/${id}`, updatedClass);
  }

  
  deleteClass(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getClassCount(): Observable<number> {
    return this.http
      .get<IEnrollmentClass[]>(this.apiUrl)
      .pipe(map((classes) => classes.length));
  }
}
