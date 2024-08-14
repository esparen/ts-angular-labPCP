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
  statistics = [
    { title: 'Alunos', detail: 100 },
    { title: 'Turmas', detail: 3 },
    { title: 'Docentes', detail: 5 },
  ];
  students = [
    {
      id: 1,
      name: 'João',
      email: 'example@mail.com',
      image: 'assets/avatar.png',
      age: 20,
      phone: '999999999',
    },
    {
      id: 2,
      name: 'Maria',
      email: 'maria@mail.com',
      image: 'assets/avatar.png',
      age: 23,
      phone: '999999999',
    },
    {
      id: 3,
      name: 'José',
      email: 'jose@mail.com',
      image: 'assets/avatar.png',
      age: 21,
      phone: '999999999',
    },
    {
      id: 4,
      name: 'Ana',
      email: 'ana@mail.com',
      image: 'assets/avatar.png',
      age: 22,
      phone: '999999999',
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  onSearch() {
    console.log('search');
  }

  isCurrentUserAdmin(): boolean {
    return this.currentUser?.role?.name === 'Admin';
  }

  isCurrentTeacher(): boolean {
    return this.currentUser?.role?.name === 'Docente';
  }
}
