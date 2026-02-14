import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.css',
})
export class CreateDoctorComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
    education: '',
    department: '',
    doctorAddress: '',
    aboutDoctor: '',
  };

  selectedFile: File | null = null;
  availableDays: string[] = [];
  timeRange = {
    fromTime: '09:00',
    toTime: '17:00'
  };
  startDate: string = '';
  endDate: string = '';
  loading: boolean = false;

  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  private readonly API_BASE = 'http://128.199.27.135:8081';

  constructor(private http: HttpClient, private router: Router) { }

  handleFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  handleDayToggle(day: string) {
    const index = this.availableDays.indexOf(day);
    if (index > -1) {
      this.availableDays.splice(index, 1);
    } else {
      this.availableDays.push(day);
    }
  }

  handleSubmit() {
    this.loading = true;

    // Construct availability string like in React: "Mon,Tue 09:00-17:00"
    const availability = `${this.availableDays.join(',')} ${this.timeRange.fromTime}-${this.timeRange.toTime}`;

    const data = new FormData();
    const doctorData = {
      ...this.formData,
      doctorAvailability: availability,
      birthDate: this.formData.birthDate || null,
      availableDateRange: this.startDate && this.endDate ? `${this.startDate} to ${this.endDate}` : null
    };

    data.append('data', JSON.stringify(doctorData));
    if (this.selectedFile) {
      data.append('file', this.selectedFile);
    }

    // Basic Auth header like in React auth: { username: 'admin', password: 'admin123' }
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin123')
    });

    this.http.post(`${this.API_BASE}/api/doctors/create`, data, { headers }).subscribe({
      next: (res) => {
        this.loading = false;
        alert('Doctor added successfully!');
        this.router.navigate(['/doctor']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error adding doctor:', err);
        alert(err.error?.message || 'Failed to add doctor');
      }
    });
  }

  cancel() {
    this.router.navigate(['/doctor']);
  }
}
