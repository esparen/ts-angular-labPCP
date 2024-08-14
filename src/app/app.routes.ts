import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { TeacherComponent } from './features/teacher/teacher.component';
import { ClassComponent } from './features/class/class.component';
import { GradeListComponent } from './features/grade-list/grade-list.component';
import { StudentComponent } from './features/student/student.component';
import { GradeComponent } from './features/grade/grade.component';
import { TeacherListComponent } from './features/teacher-list/teacher-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthenticated', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'teacher', component: TeacherComponent, canActivate: [AuthGuard] },
  { path: 'class', component: ClassComponent, canActivate: [AuthGuard] },
  {
    path: 'grade-list',
    component: GradeListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'student', component: StudentComponent, canActivate: [AuthGuard] },
  { path: 'grade', component: GradeComponent, canActivate: [AuthGuard] },
  {
    path: 'teacher-list',
    component: TeacherListComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/home' },
];
