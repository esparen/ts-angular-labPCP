import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [],
})
export class HomeComponent {
  public isSidebarOpen = true;

  constructor(
    private authService: AuthService, 
    private router: Router) {
    }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
