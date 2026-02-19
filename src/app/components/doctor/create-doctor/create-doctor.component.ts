import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { API_BASE } from '../../../api-config';

@Component({
  selector: 'app-create-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.css'
})
export class CreateDoctorComponent implements OnInit {
  formData: any = {
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

  availableDays: string[] = [];
  timeRange = { fromTime: '09:00', toTime: '17:00' };
  startDate: string = '';
  endDate: string = '';
  selectedFile: File | null = null;
  loading: boolean = false;
  isEditMode: boolean = false;
  doctorId: string | null = null;

  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  private readonly API_BASE = API_BASE;

  @ViewChild('doctorForm') doctorForm: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('id');
    if (this.doctorId) {
      this.isEditMode = true;
      this.loadDoctorData();
    }
  }

  loadDoctorData() {
    this.loading = true;
    this.http.get<any>(`${this.API_BASE}/api/doctors/${this.doctorId}`).subscribe({
      next: (res) => {
        const doctor = res?.data || res;
        this.formData = {
          firstName: doctor.firstName || '',
          lastName: doctor.lastName || '',
          email: doctor.email || '',
          phoneNumber: doctor.phoneNumber || '',
          birthDate: doctor.birthDate || '',
          gender: doctor.gender || '',
          education: doctor.education || '',
          department: doctor.department || '',
          doctorAddress: doctor.doctorAddress || '',
          aboutDoctor: doctor.aboutDoctor || '',
        };

        // Parse Availability "Mon,Tue 09:00-17:00"
        if (doctor.doctorAvailability) {
          const parts = doctor.doctorAvailability.split(' ');
          if (parts[0]) this.availableDays = parts[0].split(',');
          if (parts[1]) {
            const times = parts[1].split('-');
            this.timeRange.fromTime = times[0] || '09:00';
            this.timeRange.toTime = times[1] || '17:00';
          }
        }

        // Parse Date Range "2023-01-01 to 2023-12-31"
        if (doctor.availableDateRange) {
          const dates = doctor.availableDateRange.split(' to ');
          this.startDate = dates[0] || '';
          this.endDate = dates[1] || '';
        }

        this.loading = false;
        this.cdr.detectChanges(); // Sync data with UI immediately
      },
      error: (err) => {
        console.error('Error loading doctor:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleDayToggle(day: string) {
    const index = this.availableDays.indexOf(day);
    if (index > -1) {
      this.availableDays.splice(index, 1);
    } else {
      this.availableDays.push(day);
    }
  }

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  handleSubmit() {
    this.loading = true;
    const data = new FormData();

    // Prepare availability string
    const availability = `${this.availableDays.join(',')} ${this.timeRange.fromTime}-${this.timeRange.toTime}`;

    const doctorData = {
      ...this.formData,
      doctorAvailability: availability,
      birthDate: this.formData.birthDate || null,
      availableDateRange: this.startDate && this.endDate ? `${this.startDate} to ${this.endDate}` : null
    };

    // Use 'data' to match backend requirement and wrap in Blob for proper JSON part handling
    data.append('data', new Blob([JSON.stringify(doctorData)], { type: 'application/json' }));

    if (this.selectedFile) {
      data.append('file', this.selectedFile);
    }

    const endpoint = this.isEditMode
      ? `${this.API_BASE}/api/doctors/${this.doctorId}`
      : `${this.API_BASE}/api/doctors/create`;

    const request = this.isEditMode
      ? this.http.put(endpoint, data)
      : this.http.post(endpoint, data);

    request.subscribe({
      next: (res) => {
        this.loading = false;
        this.doctorService.clearCache(); // Invalidate list cache
        alert(this.isEditMode ? 'Doctor updated successfully!' : 'Doctor added successfully!');
        this.router.navigate(['/doctor']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error saving doctor:', err);
        alert(err.error?.message || err.message || 'Failed to save doctor');
      }
    });
  }

  cancel() {
    this.router.navigate(['/doctor']);
  }
}
