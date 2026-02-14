import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BillingCode {
  code: string;
  description: string;
  price?: string;
  quantity?: number;
  unit?: string;
  lineItem?: string;
}

@Component({
  selector: 'app-appoint-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appoint-billing.component.html',
  styleUrl: './appoint-billing.component.css'
})
export class AppointBillingComponent {
  // Mock Data
  allCodes: BillingCode[] = [
    { code: '01990', description: 'SUPPORT FOR ORGAN DONOR' },
    { code: '01991', description: 'ANESTH NERVE BLOCK/INJ' },
    { code: '01992', description: 'ANESTH N BLOCK/INJ PRONE' },
    { code: '01996', description: 'HOSP MANAGE CONT DRUG ADMIN' },
    { code: '15999', description: 'UNLISTED ANESTH PROCEDURE' },
    { code: '17999', description: 'REMOVAL OF PRESSURE SORE' },
    { code: '17990', description: 'SKIN TISSUE PROCEDURE' },
    { code: '19499', description: 'BREAST SURGERY PROCEDURE' },
    { code: '20999', description: 'MUSCULOSKELETAL SURGERY' },
    { code: '21199', description: 'RECONSTR LWR JAW W/ADVANCE' },
  ];

  // Forms State
  patientId: string = '';
  billingStatus: string = 'Select Status';
  patientPayment: string = '0.00';
  employment: string = 'No';
  postedDate: string = '2014-07-01';
  paymentProfile: string = 'Cash';
  paymentNotes: string = '';
  autoAccident: string = 'No';
  includeNote: boolean = false;
  note: string = '';

  // Search States
  searchIcd: string = '';
  showDropdownIcd: boolean = false;
  selectedIcd: BillingCode[] = [];

  searchCpt: string = '';
  showDropdownCpt: boolean = false;
  selectedCpt: BillingCode[] = [];

  searchNdc: string = '';
  showDropdownNdc: boolean = false;
  selectedNdc: any[] = [];

  searchCus: string = '';
  showDropdownCus: boolean = false;
  selectedCus: BillingCode[] = [];

  searchHcp: string = '';
  showDropdownHcp: boolean = false;
  selectedHcp: BillingCode[] = [];

  // Filter Methods
  getFiltered(search: string) {
    if (!search) return [];
    return this.allCodes.filter(item =>
      item.code.includes(search) || item.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Selection Handlers
  handleSelect(item: BillingCode, type: string) {
    switch (type) {
      case 'icd':
        this.selectedIcd.push({ ...item });
        this.searchIcd = '';
        this.showDropdownIcd = false;
        break;
      case 'cpt':
        this.selectedCpt.push({ ...item, price: '100.00' });
        this.searchCpt = '';
        this.showDropdownCpt = false;
        break;
      case 'ndc':
        this.selectedNdc.push({ ...item, quantity: 1, unit: '', lineItem: '' });
        this.searchNdc = '';
        this.showDropdownNdc = false;
        break;
      case 'cus':
        this.selectedCus.push({ ...item, price: '100.00' });
        this.searchCus = '';
        this.showDropdownCus = false;
        break;
      case 'hcp':
        this.selectedHcp.push({ ...item, price: '100.00' });
        this.searchHcp = '';
        this.showDropdownHcp = false;
        break;
    }
  }

  // Removal Handlers
  removeCode(index: number, list: any[]) {
    list.splice(index, 1);
  }

  updateNdcItem(index: number, key: string, value: any) {
    this.selectedNdc[index][key] = value;
  }
}
