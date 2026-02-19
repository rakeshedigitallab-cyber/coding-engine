import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { API_BASE } from '../../../api-config';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css'
})
export class DoctorProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private doctorService = inject(DoctorService);
  private cdr = inject(ChangeDetectorRef);

  doctor: any = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  private readonly API_BASE = API_BASE;

  // Mock data for UI placeholders
  abilities = [
    { label: 'Operations', value: 40, color: 'bg-primary' },
    { label: 'Cholesterol', value: 50, color: 'bg-success' },
    { label: 'Therapy', value: 34, color: 'bg-warning' },
    { label: 'Meditation', value: 60, color: 'bg-info' },
  ];

  experiences = [
    {
      logo: 'https://coderthemes.com/osen/layouts/assets/images/dr-profile/h-1.svg',
      title: "Brentwood's Health Company Senior CHO",
      role: 'ETN Doctor - Head - Online Consultation - Fulltime',
      duration: 'Dec 2020 - Present , 4 yr 1 mos',
      location: 'Sharon Lane Michigan City, IN 46360',
    },
    {
      logo: 'https://coderthemes.com/osen/layouts/assets/images/dr-profile/h-2.svg',
      title: 'Hospital Dynamics Head Doctor',
      role: 'ETN Doctor - General Cardiology - Fulltime',
      duration: 'Dec 2016 - Nov 2020 , 5 yr 4 mos',
      location: 'Friendship Lane Santa Clara, CA 95050',
    }
  ];

  appointments = [
    { name: 'John Doe', date: 'July 1, 2024', time: '9:00 AM', phone: '+(567) 890-1234', reason: 'Annual Check-up' },
    { name: 'Jane Smith', date: 'July 1, 2024', time: '9:30 AM', phone: '+(456) 789-0123', reason: 'Consultation' },
    { name: 'Mike Johnson', date: 'July 1, 2024', time: '10:00 AM', phone: '+(345) 678-9012', reason: 'Lab Results Review' }
  ];

  ngOnInit() {
    console.log('DoctorProfileComponent Initialized');
    this.route.params.subscribe({
      next: (params) => {
        const id = params['id'];
        console.log('Detected Doctor ID:', id);
        if (id) {
          this.fetchDoctor(id);
        } else {
          this.loading = false;
          this.errorMessage = "Doctor ID missing in URL";
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Route params subscription error:', err);
        this.loading = false;
        this.errorMessage = "Routing error";
        this.cdr.detectChanges();
      }
    });
  }

  fetchDoctor(id: string) {
    this.loading = true;
    this.errorMessage = null;
    this.doctor = null;
    this.cdr.detectChanges();

    this.doctorService.getDoctorById(id).subscribe({
      next: (data) => {
        console.log('Doctor data received:', data);
        if (data) {
          this.doctor = data;
          this.loading = false;
        } else {
          this.errorMessage = "Doctor profile not found (Empty data)";
          this.loading = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error in fetchDoctor:', err);
        this.errorMessage = "Could not load profile. Is backend running?";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getProfileImage(photo: string) {
    if (!photo) return 'https://coderthemes.com/osen/layouts/assets/images/users/avatar-3.jpg';
    return `${this.API_BASE}/api/doctors/images/${photo}`;
  }

  handleImageError(event: any) {
    event.target.src = 'https://coderthemes.com/osen/layouts/assets/images/users/avatar-3.jpg';
  }

  retry() {
    console.log('Retrying fetch...');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.fetchDoctor(id);
    else this.loading = false;
  }
}
