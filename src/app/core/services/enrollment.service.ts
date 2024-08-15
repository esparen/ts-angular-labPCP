import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface IEnrollmentClass {
  id: number;
  name: string;
  teacherId: number; 
  studentIds: number[]; 
  subjectId?: number;
  courseId: number;
}
export interface IDisciplines{
  id: number;
  name: string;
}


@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:3000/turma';
  private disciplinesApiUrl = 'http://localhost:3000/materia';

  constructor(private http: HttpClient) {}

  getEnrollments(): Observable<IEnrollmentClass[]> {
    return this.http.get<IEnrollmentClass[]>(this.apiUrl);
  }

  getEnrollmentById(id: number): Observable<IEnrollmentClass> {
    return this.http.get<IEnrollmentClass>(`${this.apiUrl}/${id}`);
  }

  addEnrollment(newClass: IEnrollmentClass): Observable<IEnrollmentClass> {
    return this.http.post<IEnrollmentClass>(this.apiUrl, newClass);
  }

  updateEnrollment(
    id: number,
    updatedClass: IEnrollmentClass
  ): Observable<IEnrollmentClass> {
    return this.http.put<IEnrollmentClass>(
      `${this.apiUrl}/${id}`,
      updatedClass
    );
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEnrollmentCount(): Observable<number> {
    return this.http
      .get<IEnrollmentClass[]>(this.apiUrl)
      .pipe(map((classes) => classes.length));
  }

  getDisciplines(): Observable<IDisciplines[]> {
    return this.http.get<IDisciplines[]>(this.disciplinesApiUrl);
  }

  getDisciplineById(id: number): Observable<IDisciplines> {
    return this.http.get<IDisciplines>(`${this.disciplinesApiUrl}/${id}`);
  }

  getEnrollmentsByStudentId(studentId: number): Observable<IEnrollmentClass[]> {
    return this.http
      .get<IEnrollmentClass[]>(this.apiUrl)
      .pipe(
        map((classes) =>{
          return classes.filter((enrollment) =>
          {
            const response = enrollment.studentIds.includes(Number(studentId));
            return response
          }
          );
        })
      );
  }
}
