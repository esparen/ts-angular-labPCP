import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserService, IUser as IStudent } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly studentRoleId = 3;

  constructor( private userService: UserService) {}

  getStudents(): Observable<IStudent[]> {
    return this.userService.getUsersByRole(this.studentRoleId);
  }
  
  getStudentById(id: number): Observable<IStudent> {
     return this.userService.getUserById(id)
       .pipe(
         filter((user) => user.papelId === this.studentRoleId),
         map((user) => user)
       );
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
