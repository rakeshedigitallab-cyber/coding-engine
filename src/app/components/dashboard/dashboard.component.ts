import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  stats = [
    { title: 'Total Patients', value: '1,245', icon: 'bi-people', color: 'bg-primary-subtle', textColor: 'text-primary' },
    { title: 'Appointments', value: '86', icon: 'bi-calendar-check', color: 'bg-success-subtle', textColor: 'text-success' },
    { title: 'Operations', value: '24', icon: 'bi-heart-pulse', color: 'bg-danger-subtle', textColor: 'text-danger' },
    { title: 'New Consultations', value: '12', icon: 'bi-chat-dots', color: 'bg-info-subtle', textColor: 'text-info' }
  ];

  recentPatients = [
    { id: '#P-0012', name: 'John Doe', age: 32, doctor: 'Dr. Smith', date: '06 Feb 2026', status: 'Approved', statusClass: 'bg-success' },
    { id: '#P-0013', name: 'Sarah Connor', age: 45, doctor: 'Dr. Sarah', date: '06 Feb 2026', status: 'Pending', statusClass: 'bg-warning' },
    { id: '#P-0014', name: 'Michael Brown', age: 28, doctor: 'Dr. Emily', date: '05 Feb 2026', status: 'Rejected', statusClass: 'bg-danger' },
    { id: '#P-0015', name: 'Emily White', age: 24, doctor: 'Dr. Smith', date: '05 Feb 2026', status: 'Approved', statusClass: 'bg-success' }
  ];

  doctors = [
    { name: 'Dr. Smith', specialty: 'Cardiology', status: 'Available' },
    { name: 'Dr. Sarah', specialty: 'Neurology', status: 'Busy' },
    { name: 'Dr. Emily', specialty: 'Pediatrics', status: 'Available' },
    { name: 'Dr. John', specialty: 'Orthopedics', status: 'Offline' }
  ];
}
