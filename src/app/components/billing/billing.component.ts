import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IcdCode10Component } from '../icd-code10/icd-code10.component';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, RouterLink, IcdCode10Component],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css',
})
export class BillingComponent {
  activeTab: number = 0;
  tabLabels = ['ICDCode10'];

  setActiveTab(index: number) {
    this.activeTab = index;
  }
}
