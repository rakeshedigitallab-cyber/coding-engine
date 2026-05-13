import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { API_BASE } from '../api-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const hasToken = !!localStorage.getItem('token');
    this.isLoggedInSubject.next(loggedIn && hasToken);
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  sendOtp(identifier: string): Observable<string> {
    const url = `${API_BASE}/auth/send-otp?identifier=${encodeURIComponent(identifier)}`;
    return this.http.post(url, null, { responseType: 'text' });
  }

  verifyOtp(identifier: string, otp: string): Observable<string> {
    const url = `${API_BASE}/auth/verify-otp?identifier=${encodeURIComponent(identifier)}&otp=${encodeURIComponent(otp)}`;
    return this.http.post(url, null, { responseType: 'text' }).pipe(
      tap((token: string) => {
        if (token) {
           localStorage.setItem('token', token);
        }
        this.login();
      })
    );
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${API_BASE}/auth/me`, { headers });
  }

  login() {
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedInSubject.next(true);
  }

  logout(): Observable<any> {
    // 1. Local session clear pehle karo taaki UI turant update ho
    this.clearLocalSession();
    
    // 2. Phir backend logout call best-effort karo
    return this.http.post(`${API_BASE}/auth/logout`, {}, { responseType: 'text' }).pipe(
      catchError(err => {
        console.warn('Backend logout failed or not implemented:', err);
        return of(null);
      })
    );
  }

  private clearLocalSession() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }
}
