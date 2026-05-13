import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  termsCheck: boolean = false;
  otp: string = '';

  step: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  registerAndSendOtp() {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }
    if (!this.termsCheck) {
      this.errorMessage = 'You must agree to the Terms and Conditions.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.authService.sendOtp(this.email).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('OTP Send operation finalized.');
      })
    ).subscribe({
      next: (res) => {
        console.log('OTP Sent Successfully:', res);
        this.step = 2; 
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('OTP Send Error:', err);
        this.errorMessage = 'Failed to send OTP. Error: ' + (err.message || 'Unknown error');
        this.cdr.detectChanges();
      }
    });
  }

  verifyOtp() {
    if (!this.otp || this.otp.length < 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.authService.verifyOtp(this.email, this.otp).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        console.log('Verification Success:', res);
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Verification Error:', err);
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
