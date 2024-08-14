import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class AppSidebarComponent {
  @ViewChild('sidenav')  sidenav!: MatSidenav;
  events: string[] = [];
  opened: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.opened = !this.opened;
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  get isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role.name === 'Admin';
  }

  get isDocente(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role.name === 'Docente';
  }

  get isAluno(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role.name === 'Aluno';
  }
}