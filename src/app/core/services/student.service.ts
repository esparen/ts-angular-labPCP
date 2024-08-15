import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { UserService, IUser as IStudent } from './user.service';
import { EnrollmentService, IEnrollmentClass, IDisciplines } from './enrollment.service';
import { GradeService, IGrade } from './grade.service';

export interface IStudentEnrollment extends IEnrollmentClass {
  materiaName: string
}

export interface IStudentGrade extends IGrade {
  materiaName: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly studentRoleId = 3;
  private readonly subjectApiUrl = 'http://localhost:3000/materia';

  constructor(
    private userService: UserService,
    private enrollmentService: EnrollmentService,
    private gradeService: GradeService
  ) {}

  getStudents(): Observable<IStudent[]> {
    return this.userService.getUsersByRole(this.studentRoleId);
  }

  getStudentById(id: number): Observable<IStudent> {
    return this.userService.getUserById(id).pipe(
      filter((user) => user.papelId === this.studentRoleId),
      map((user) => user)
    );
  }

  getEnrollments(studentId: number): Observable<IEnrollmentClass[]> {
    return this.enrollmentService.getEnrollmentsByStudentId(studentId); 
  }


  getGrades(studentId: number): Observable<IStudentGrade[]> {
    return this.gradeService
      .getGradesByStudent(studentId)
      .pipe(mergeMap((grades) => this.addDisciplineNames(grades)));
  }

  private addDisciplineNames(grades: IGrade[]): Observable<IStudentGrade[]> {
    return this.enrollmentService
      .getDisciplines()
      .pipe(
        map((disciplines) =>
          grades.map((grade) => this.mapGradeToDiscipline(grade, disciplines))
        )
      );
  }

  private mapGradeToDiscipline(
    grade: IGrade,
    disciplines: IDisciplines[]
  ): IStudentGrade {
    const discipline = disciplines.find((d) => {
      return d.id == Number(grade.materiaId);
    });
    return {
      ...grade,
      materiaName: discipline?.name || 'Unknown',
    };
  }

  getGradesByOrder(
    studentId: number,
    order: 'desc' | 'asc' = 'desc',
    limit: number = 3
  ): Observable<IStudentGrade[]> {
    return this.gradeService
      .getGradesByOrder(studentId, order, limit)
      .pipe(mergeMap((grades) => this.addDisciplineNames(grades)));
  }

  addStudent(student: IStudent): Observable<IStudent> {
    student.papelId = this.studentRoleId; // Ensure the role is set to Student
    return this.userService.addUser(student);
  }

  setStudent(student: IStudent): Observable<IStudent> {
    if (student.papelId !== this.studentRoleId) {
      throw new Error('Invalid role for student');
    }
    return this.userService.setUser(student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.userService.deleteUser(id);
  }

  getStudentCount(): Observable<number> {
    return this.getStudents().pipe(map((students) => students.length));
  }
}
