import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './new-patients.component.html',
  styleUrl: './new-patients.component.css',
})
export class NewPatientsComponent {
  currentStep: number = 1;

  formData: any = {
    title: '',
    firstName: '',
    nickName: '',
    middleName: '',
    lastName: '',
    birthName: '',
    phone: '',
    cellPhone: '',
    email: '',
    alternateEmail: '',
    nationalIdNumber: '',
    dateOfBirth: '',
    sex: '',
    genderIdentity: '',
    sexualOrientation: '',
    ethnicity: '',
    preferredLanguage: '',
    country: '',
    streetAddress: '',
    zipCode: '',
    city: '',
    state: '',
    insuranceCompany: '',
    carrierPayerId: '',
    tplCode: '',
    insuranceIdNumber: '',
    insuranceGroupName: '',
    insuranceGroupNumber: '',
    insurancePlanName: '',
    insurancePlanType: '',
    insuranceClaimOfficeNumber: '',
    visitsAllowedPerYear: '',
    cardIssuedDate: '',
    insuranceNotes: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  onSubmit() {
    console.log('Submitting data:', this.formData);

    // Check if at least one field is filled
    const hasAtLeastOneField = Object.values(this.formData).some(value => value && String(value).trim() !== '');

    if (!hasAtLeastOneField) {
      alert('Please fill in at least one field before submitting.');
      return;
    }

    this.http.post('http://localhost:8081/patients/create', this.formData).subscribe({
      next: (res) => {
        alert('Patient data saved successfully!');
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        console.error('Error submitting patient data:', err);
        alert('Error saving patient data.');
      }
    });
  }
}
