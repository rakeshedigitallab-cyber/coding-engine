import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { API_BASE } from '../../../api-config';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css',
})
export class DoctorListComponent implements OnInit {
  protected readonly Math = Math;
  doctors: any[] = [];
  initialData: any[] = [];
  filterValue: string = '';
  page: number = 1;
  rowsPerPage: number = 10;
  isLoading: boolean = false;
  isUploading: boolean = false;
  sortConfig = { key: '', direction: 'asc' };
  hiddenColumns: string[] = [];
  showColumnMenu: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  columnDefinitions = [
    { key: 'id', label: 'Doctor ID', align: 'left' },
    { key: 'profilePhotoUrl', label: 'Picture', align: 'left' },
    { key: 'firstName', label: 'First Name', align: 'left' },
    { key: 'lastName', label: 'Last Name', align: 'left' },
    { key: 'phoneNumber', label: 'Phone Number', align: 'left' },
    { key: 'email', label: 'Email', align: 'left' },
    { key: 'gender', label: 'Gender', align: 'left' },
    { key: 'department', label: 'Department', align: 'left' },
    { key: 'aboutDoctor', label: 'Experience', align: 'left' },
    { key: 'actions', label: 'Actions', align: 'center' },
  ];

  private readonly API_BASE = API_BASE;

  constructor(
    private http: HttpClient,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.fetchDoctors();
  }

  fetchDoctors() {
    // Only show big loader if we have NO data yet
    if (this.doctors.length === 0) {
      this.isLoading = true;
    }

    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.initialData = [...this.doctors];
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredData() {
    const term = this.filterValue.toLowerCase().trim();
    if (!term) return this.sortedData;

    return this.sortedData.filter(item =>
      Object.entries(item).some(([key, value]) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      })
    );
  }

  get sortedData() {
    if (!this.sortConfig.key) return this.doctors;

    return [...this.doctors].sort((a, b) => {
      const aVal = a[this.sortConfig.key];
      const bVal = b[this.sortConfig.key];
      if (aVal < bVal) return this.sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  get paginatedData() {
    const start = (this.page - 1) * this.rowsPerPage;
    return this.filteredData.slice(start, start + this.rowsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.rowsPerPage) || 1;
  }

  requestSort(key: string) {
    if (key === 'actions') return;
    if (this.sortConfig.key === key) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.key = key;
      this.sortConfig.direction = 'asc';
    }
  }

  toggleColumn(key: string) {
    const index = this.hiddenColumns.indexOf(key);
    if (index > -1) {
      this.hiddenColumns.splice(index, 1);
    } else {
      this.hiddenColumns.push(key);
    }
  }

  isColumnVisible(key: string) {
    return !this.hiddenColumns.includes(key);
  }

  handleDelete(id: any) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => {
          this.doctors = this.doctors.filter(d => d.id !== id);
          this.initialData = [...this.doctors];
          this.cdr.detectChanges();
          alert('Doctor deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting doctor:', err);
          alert('Failed to delete doctor');
        }
      });
    }
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.isUploading = true;
      this.http.post(`${this.API_BASE}/icd10/post`, formData).subscribe({
        next: () => {
          this.isUploading = false;
          alert('Upload successful!');
          this.fetchDoctors();
        },
        error: (err) => {
          this.isUploading = false;
          alert('Upload failed!');
        }
      });
    }
  }

  exportPDF() {
    // In a real app we'd import jsPDF, but for now we'll mock the action
    console.log('Exporting PDF...');
    window.print();
  }

  getProfileImage(photo: string) {
    if (!photo) return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    return `${this.API_BASE}/api/doctors/images/${photo}`;
  }

  handleImageError(event: any) {
    event.target.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  }
}
