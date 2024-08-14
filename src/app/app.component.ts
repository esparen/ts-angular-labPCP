import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AppSidebarComponent } from './core/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppSidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'labPCP - Gestão Educational';
  constructor(private router: Router) {}

  isLoginPage(): boolean {    
    return this.router.url === '/login';
  }
}
