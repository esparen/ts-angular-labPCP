import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { EnrollmentService, IEnrollmentClass } from '../../core/services/enrollment.service';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../../core/interfaces/user.interface';

type typeViewMode = 'read' | 'insert' | 'edit';
@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    FormsModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'ja-JP' }],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss',
})
export class GradeComponent implements OnInit {
  gradeForm: FormGroup;
  teachers: IUser[] = [];
  enrollments = [] as IEnrollmentClass[];
  students: IUser[] = [];
  filteredStudents: IUser[] = [];
  selectedEnrollment: string | null = null;
  isTeacher: boolean = false;
  viewMode: typeViewMode = 'read';
  gradeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.gradeForm = this.fb.group({
      teacher: ['', Validators.required],
      enrollment: ['', Validators.required],
      gradeName: ['', Validators.required],
      gradeDate: ['', Validators.required],
      student: ['', Validators.required],
      grade: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    });
  }

  ngOnInit() {
    this.loadInitialData();
    const paramGradeId = this.route.snapshot.queryParamMap.get('id');
    if (!paramGradeId) {
      this.viewMode = 'insert';
      this.gradeForm.enable();
      //this.loadGradeData(this.gradeId);
      //this.viewMode = 'read';
      //this.gradeForm.disable();
    } else {
      this.gradeId = paramGradeId;
    }
    /* this.filteredStudents = this.gradeForm.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filterStudents(name as string)
          : this.students.slice();
      })
    ); */
  }

  private _filterStudents(value: string): IUser[] {
    const filterValue = value.toLowerCase();

    return this.students.filter((student) =>
      student.name.toLowerCase().includes(filterValue)
    );
  }

  loadInitialData() {
    if (this.authService.isAdmin()) {
      this.userService.getAllTeachers().subscribe((data: IUser[]) => {
        this.teachers = data;
      });
    } else if (this.authService.isTeacher()) {
      const currentTeacher = this.authService.getCurrentUser();
      this.teachers = [currentTeacher!];
      this.isTeacher = true;
      this.gradeForm.get('teacher')?.setValue(currentTeacher.id);
    }

    this.enrollmentService
      .getEnrollments()
      .subscribe((data: IEnrollmentClass[]) => {
        this.enrollments = data;
        console.log('Enrollments:', this.enrollments);
      });

    this.studentService.getStudents().subscribe((data: IUser[]) => {
      this.students = data;
      this.filteredStudents = data;
    });
  }

  displayFn(user: IUser): string {
    return user && user.name ? user.name : '';
  }

  onEnrollmentSelected() {
    // Handle class selection if necessary
  }

  onSave() {
    if (this.gradeForm.valid) {
      // Save logic here
      alert('Avaliação cadastrada com sucesso!');
    }
  }

  enableEdit() {
    // Logic to switch to edit mode
    this.viewMode = 'edit';
    this.gradeForm.enable();
  }

  cancelEdit() {
    if (this.gradeId) {
      //this.loadGradeData(this.teacherId);
    } else {
      this.gradeForm.reset();
    }
    this.viewMode = 'read';
    this.gradeForm.disable();
  }

  onDelete() {
    if (!this.gradeId) return;
    this.userService.deleteUser(this.gradeId).subscribe(() => {
      this.snackBar.open('Docente excluído com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.gradeForm.reset();
    });
  }
}
