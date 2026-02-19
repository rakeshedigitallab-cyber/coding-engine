import { Component, OnInit, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { API_BASE } from '../../../api-config';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css',
})
export class PatientsListComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private patientService = inject(PatientService);
  private http = inject(HttpClient);

  data: any[] = [];
  initialData: any[] = [];
  filterValue: string = '';
  page: number = 1;
  rowsPerPage: number = 20;
  sortConfig = { key: '', direction: 'asc' };
  hiddenColumns: string[] = [];
  isLoading: boolean = false;
  isUploading: boolean = false;
  openDialog: boolean = false;
  selectedPatient: any = null;
  anchorEl: HTMLElement | null = null;

  columnDefinitions = [
    { key: 'id', label: 'Patient ID', align: 'left' },
    { key: 'lastName', label: 'Last Name', align: 'left' },
    { key: 'firstName', label: 'First Name', align: 'left' },
    { key: 'homePhone', label: 'Home Phone', align: 'left' },
    { key: 'cellPhone', label: 'Cell Phone', align: 'left' },
    { key: 'email', label: 'Email', align: 'left' },
    { key: 'sex', label: 'Sex', align: 'left' },
    { key: 'city', label: 'City', align: 'left' },
    { key: 'country', label: 'Country', align: 'left' },
    { key: 'insuranceIdNumber', label: 'Insurance Id', align: 'left' },
    { key: 'actions', label: 'Actions', align: 'center' },
  ];

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.patientService.getPatients(true).subscribe({
      next: (res) => {
        this.data = res;
        this.initialData = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredData() {
    const searchTerm = this.filterValue.toLowerCase().trim();
    let result = [...this.initialData];

    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item).some(val =>
          val && val.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    if (this.sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[this.sortConfig.key];
        const bValue = b[this.sortConfig.key];
        if (aValue < bValue) return this.sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  get paginatedData() {
    const start = (this.page - 1) * this.rowsPerPage;
    return this.filteredData.slice(start, start + this.rowsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.rowsPerPage);
  }

  requestSort(key: string) {
    if (key === 'actions') return;
    let direction = 'asc';
    if (this.sortConfig.key === key && this.sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    this.sortConfig = { key, direction };
    this.cdr.detectChanges();
  }

  handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.cdr.detectChanges();
    }
  }

  toggleColumnVisibility(columnKey: string) {
    const index = this.hiddenColumns.indexOf(columnKey);
    if (index === -1) {
      this.hiddenColumns.push(columnKey);
    } else {
      this.hiddenColumns.splice(index, 1);
    }
    this.cdr.detectChanges();
  }

  showAllColumns() {
    this.hiddenColumns = [];
    this.cdr.detectChanges();
  }

  handleOpenDialog(patient: any) {
    this.selectedPatient = patient;
    this.openDialog = true;
  }

  handleCloseDialog() {
    this.openDialog = false;
    this.selectedPatient = null;
  }

  handleConfirmDelete() {
    if (!this.selectedPatient) return;
    const idToDelete = this.selectedPatient.id;

    this.patientService.deletePatient(idToDelete).subscribe({
      next: () => {
        // Update local state instantly
        this.initialData = this.initialData.filter(item => item.id !== idToDelete);
        this.data = [...this.initialData];

        this.handleCloseDialog();
        this.cdr.detectChanges();
        alert('Patient deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting patient:', err);
        alert('Failed to delete patient');
        this.handleCloseDialog();
        this.cdr.detectChanges();
      }
    });
  }

  getColumnWidth(key: string): string {
    switch (key) {
      case 'id': return '100px';
      case 'lastName': return '120px';
      case 'firstName': return '120px';
      case 'homePhone': return '120px';
      case 'cellPhone': return '120px';
      case 'email': return '160px';
      case 'sex': return '60px';
      case 'city': return '120px';
      case 'country': return '100px';
      case 'insuranceIdNumber': return '140px';
      case 'actions': return '100px';
      default: return '150px';
    }
  }

  renderCellValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  }

  exportPDF() {
    console.log('Exporting PDF...');
  }

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadXmlFile(file);
    }
  }

  uploadXmlFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    this.isUploading = true;

    this.http.post(`${API_BASE}/icd10/post`, formData).subscribe({
      next: () => {
        this.isUploading = false;
        this.fetchData();
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isUploading = false;
      }
    });
  }

  toggleMenu(event: Event) {
    this.anchorEl = this.anchorEl ? null : (event.currentTarget as HTMLElement);
  }
}
