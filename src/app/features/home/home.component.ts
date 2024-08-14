import { Component } from '@angular/core';
import { AuthService, IUser } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../../core/services/student.service';
import { UserService, IUser as IDatabaseUser } from '../../core/services/user.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
  ],
})
export class HomeComponent {
  studentSearchTerm: string = '';
  currentUser: IUser | null = null;
  statistics = [] as { title: string; detail: number }[];
  students = [] as IDatabaseUser[];
  teachers = [] as IDatabaseUser[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private studentService: StudentService,
    private userService: UserService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.studentService.getStudents().subscribe((data) => {
      this.students = data;
      this.statistics.push({ title: 'Alunos', detail: this.students.length });
    });
    this.userService.getUsersByRole(2).subscribe((data) => {
      this.teachers = data;
      this.statistics.push({ title: 'Docentes', detail: this.teachers.length });
    });
    this.enrollmentService.getClassCount().subscribe((data) => {
      this.statistics.push({ title: 'Turmas', detail: data });
    });
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  onSearch() {
    const searchTerm = this.studentSearchTerm.toLowerCase();

    this.studentService.getStudents().subscribe((data) => {
      this.students = data.filter((student) => {
        return (
          student.name.toLowerCase().includes(searchTerm) ||
          student.age?.toString().includes(searchTerm) ||
          student.phone?.includes(searchTerm)
        );
      });
    });
  }

  isCurrentUserAdmin(): boolean {
    return this.currentUser?.role?.name === 'Admin';
  }

  isCurrentTeacher(): boolean {
    return this.currentUser?.role?.name === 'Docente';
  }
}
