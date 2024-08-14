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

  getClasses(): Observable<IEnrollmentClass[]> {
    return this.http.get<IEnrollmentClass[]>(this.apiUrl);
  }

  getClassById(id: number): Observable<IEnrollmentClass> {
    return this.http.get<IEnrollmentClass>(`${this.apiUrl}/${id}`);
  }

  addClass(newClass: IEnrollmentClass): Observable<IEnrollmentClass> {
    return this.http.post<IEnrollmentClass>(this.apiUrl, newClass);
  }

  updateClass(
    id: number,
    updatedClass: IEnrollmentClass
  ): Observable<IEnrollmentClass> {
    return this.http.put<IEnrollmentClass>(
      `${this.apiUrl}/${id}`,
      updatedClass
    );
  }

  deleteClass(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getClassCount(): Observable<number> {
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
        map((classes) =>
          classes.filter((enrollment) =>
            enrollment.studentIds.includes(studentId)
          )
        )
      );
  }
}
