import { Component, signal } from '@angular/core';
import { LayoutService } from './services/layout.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hospital-app');
  public isAuthRoute = false;

  constructor(
    public layoutService: LayoutService, 
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAuthRoute = event.urlAfterRedirects.includes('/login') || event.urlAfterRedirects.includes('/register');
      }
    });

    // Auto-redirect if logout happens
    this.authService.isLoggedIn$.subscribe(loggedIn => {
       if (!loggedIn && !this.isAuthRoute) {
          this.router.navigate(['/login']);
       }
    });
  }
}
