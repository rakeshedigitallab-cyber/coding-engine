import { Component, OnInit, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_BASE } from '../../api-config';

interface ColumnDef {
  key: string;
  label: string;
  align: 'left' | 'center' | 'right';
  width: string;
}

@Component({
  selector: 'app-code-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './code-list.component.html',
  styleUrl: './code-list.component.css',
})
export class CodeListComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private readonly API_BASE = API_BASE;

  initialData: any[] = [];
  data: any[] = [];
  filterValueInternal: string = '';
  page: number = 1;
  rowsPerPage: number = 25;
  isLoading: boolean = false;
  isUploading: boolean = false;
  isDownloading: boolean = false;

  sortConfig = { key: '', direction: 'asc' };
  hiddenColumns: string[] = []; // Default to show all headers as per user request
  isColumnMenuOpen: boolean = false;

  columnDefinitions: ColumnDef[] = [
    { key: 'chapterName', label: 'Chapter', align: 'center', width: '80px' },
    { key: 'chapterDesc', label: 'Chapter Desc', align: 'left', width: '250px' },
    { key: 'chapterNotes', label: 'Notes', align: 'left', width: '40px' },
    { key: 'sectionRef1', label: 'SectionRef1', align: 'left', width: '120px' },
    { key: 'sectionRef2', label: 'SectionRef2', align: 'left', width: '120px' },
    { key: 'sectionNotes', label: 'Notes', align: 'left', width: '40px' },
    { key: 'sectionId', label: 'Section ID', align: 'left', width: '120px' },
    { key: 'sectionDesc', label: 'Section Desc', align: 'left', width: '300px' },
    { key: 'sectionDescNotes', label: 'Notes', align: 'left', width: '40px' },
    { key: 'parentCode', label: 'Parent Code', align: 'left', width: '150px' },
    { key: 'parentCodeDesc', label: 'Parent Desc', align: 'left', width: '250px' },
    { key: 'indentationLevel', label: 'Ind Level', align: 'left', width: '100px' },
    { key: 'icdCode', label: 'ICD Code', align: 'left', width: '120px' },
    { key: 'codeDescription', label: 'Code Desc', align: 'left', width: '300px' },
    { key: 'sevenChrNote', label: 'SevenChr Note', align: 'left', width: '40px' },
    { key: 'sevenChrDef', label: 'SevenChrDef', align: 'left', width: '180px' },
    { key: 'inclusionTerm', label: 'Inclusion Term', align: 'left', width: '250px' },
    { key: 'includes', label: 'Includes', align: 'left', width: '180px' },
    { key: 'includesCodes', label: 'Includes Codes', align: 'left', width: '180px' },
    { key: 'codeFirst', label: 'CodeFirst', align: 'left', width: '180px' },
    { key: 'codeFirstCodes', label: 'CodeFirst Codes', align: 'left', width: '180px' },
    { key: 'codeAlso', label: 'CodeAlso', align: 'left', width: '180px' },
    { key: 'codeAlsoCodes', label: 'CodeAlso Codes', align: 'left', width: '180px' },
    { key: 'useAdditinalCode,Ifapplicable', label: 'Use AdditinalCode, If applicable', align: 'left', width: '250px' },
    { key: 'useAdditinalCode,IfapplicableCode', label: 'Use AdditinalCode, If applicable Codes', align: 'left', width: '300px' },
    { key: 'useAdditinalCode', label: 'Use Additional Codes', align: 'left', width: '220px' },
    { key: 'useAdditinalCodeCodes', label: 'Use Additional Codes Codes', align: 'left', width: '250px' },
    { key: 'excludes1', label: 'Excludes1', align: 'left', width: '180px' },
    { key: 'excludes1Codes', label: 'Excludes1 Codes', align: 'left', width: '180px' },
    { key: 'excludes2', label: 'Excludes2', align: 'left', width: '180px' },
    { key: 'excludes2Codes', label: 'Excludes2 Codes', align: 'left', width: '180px' },
    { key: 'manifestationCode', label: 'Manifestation Code', align: 'left', width: '200px' },
    { key: 'manifestationCodeCodes', label: 'Manifestation Code Codes', align: 'left', width: '220px' },
  ];

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit() {
    this.fetchData();
  }

  get filterValue(): string {
    return this.filterValueInternal;
  }

  set filterValue(val: string) {
    this.filterValueInternal = val;
    this.applyFilters();
  }

  requestSort(key: string) {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.key = key;
      this.sortConfig.direction = 'asc';
    }
    this.applyFilters();
  }

  fetchData() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.http.get<any>(`${this.API_BASE}/icd10/all`).subscribe({
      next: (res) => {
        let extractedData = [];
        if (Array.isArray(res)) extractedData = res;
        else if (res?.data && Array.isArray(res.data)) extractedData = res.data;
        else if (res?.data?.data && Array.isArray(res.data.data)) extractedData = res.data.data;
        else if (res?.content && Array.isArray(res.content)) extractedData = res.content;

        this.initialData = extractedData;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI to show data immediately
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    const term = this.filterValue.toLowerCase().trim();
    let processed = [...this.initialData];

    // Filter
    if (term) {
      processed = processed.filter(item =>
        Object.values(item).some(val =>
          val && val.toString().toLowerCase().includes(term)
        )
      );
    }

    // Sort
    if (this.sortConfig.key) {
      processed.sort((a, b) => {
        const aVal = a[this.sortConfig.key] ?? '';
        const bVal = b[this.sortConfig.key] ?? '';
        if (aVal < bVal) return this.sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.data = processed;
    this.page = 1; // Reset to first page on filter/sort change
  }

  get paginatedData() {
    const start = (this.page - 1) * this.rowsPerPage;
    return this.data.slice(start, start + this.rowsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.data.length / this.rowsPerPage) || 1;
  }

  handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
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

  showAllColumns() {
    this.hiddenColumns = [];
  }

  renderCellValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  downloadExcel() {
    this.isDownloading = true;
    this.http.get(`${this.API_BASE}/icd10/download`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ICD10_Data.xlsx';
        a.click();
        this.isDownloading = false;
      },
      error: () => this.isDownloading = false
    });
  }

  exportPDF() {
    alert('PDF Export initiated');
  }

  triggerUpload() {
    this.fileInput.nativeElement.click();
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
    this.http.post(`${this.API_BASE}/icd10/post`, formData).subscribe({
      next: () => {
        this.isUploading = false;
        this.fetchData();
        alert('Upload successful!');
      },
      error: () => {
        this.isUploading = false;
        alert('Upload failed!');
      }
    });
  }

  get rangeText(): string {
    if (this.data.length === 0) return 'Showing 0-0 of 0 items';
    const start = (this.page - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.page * this.rowsPerPage, this.data.length);
    return `Showing ${start}-${end} of ${this.data.length} items`;
  }
}

