import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  identifier: string = '';
  otp: string = '';
  
  step: number = 1; // 1 = input identifier, 2 = verify OTP
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  sendOtp() {
    if (!this.identifier) {
       this.errorMessage = 'Please enter your email or phone number.';
       return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    
    this.authService.sendOtp(this.identifier).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
       next: (res) => {
          console.log('Login OTP Sent:', res);
          this.step = 2;
          this.errorMessage = '';
          this.cdr.detectChanges();
       },
       error: (err) => {
          console.error('Login OTP Error:', err);
          this.errorMessage = 'Failed to send OTP. Error: ' + (err.message || 'Unknown error');
          this.cdr.detectChanges();
       }
    });
  }

  verifyOtp() {
    if (!this.otp) {
       this.errorMessage = 'Please enter the OTP.';
       return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.authService.verifyOtp(this.identifier, this.otp).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
       next: (res) => {
          this.router.navigate(['/']); 
       },
       error: (err) => {
          console.error('Verify Error:', err);
          this.errorMessage = 'Invalid OTP. Please try again.';
          this.cdr.detectChanges();
       }
    });
  }

  goBack() {
    this.step = 1;
    this.otp = '';
    this.errorMessage = '';
  }
}
