import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_BASE } from '../../api-config';

@Component({
  selector: 'app-icd-code10',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './icd-code10.component.html',
  styleUrl: './icd-code10.component.css',
})
export class IcdCode10Component implements OnInit {
  private http = inject(HttpClient);

  data: any[] = [];
  search: string = '';
  showDropdown: boolean = false;
  selectedRows: any[] = [];

  ngOnInit() {
    this.fetchData();
  }

  get filtered() {
    if (!this.search) return [];

    // Filter by search and ensure uniqueness by icdCode
    const filteredResults = this.data.filter(item =>
      (item.icdCode && item.icdCode.includes(this.search)) ||
      (item.codeDescription && item.codeDescription.toLowerCase().includes(this.search.toLowerCase()))
    );

    // Filter unique items
    return filteredResults.filter((item, index, self) =>
      index === self.findIndex(t => t.icdCode === item.icdCode)
    );
  }

  fetchData() {
    this.http.get<any[]>(`${API_BASE}/icd10/all`).subscribe({
      next: (allData) => {
        const updatedData = allData.map(item => {
          const isUnspecified = item.codeDescription
            ?.trim()
            .toLowerCase()
            .endsWith("unspecified");

          // Determine if it's billable: no other code starts with this code + "."
          const hasChild = allData.some(other =>
            other.icdCode !== item.icdCode &&
            other.icdCode.startsWith(item.icdCode + ".")
          );

          return {
            ...item,
            unspecifiedInfo: isUnspecified ? "unspecified" : null,
            billableInfo: hasChild ? "Non-Billable Code" : "Billable Code"
          };
        });
        this.data = updatedData;
      },
      error: (error) => {
        console.error("Error fetching data:", error);
      }
    });
  }

  handleSelect(item: any) {
    const alreadySelected = this.selectedRows.some(row => row.icdCode === item.icdCode);
    if (!alreadySelected) {
      this.selectedRows.push(item);
    }
    this.search = '';
    this.showDropdown = false;
  }

  removeIcd(index: number) {
    this.selectedRows.splice(index, 1);
  }

  closeDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
}
