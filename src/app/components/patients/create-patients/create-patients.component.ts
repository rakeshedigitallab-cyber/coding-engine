import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-create-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './create-patients.component.html',
  styleUrl: './create-patients.component.css',
})
export class CreatePatientsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private patientService = inject(PatientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  currentStep: number = 1;
  isEditMode: boolean = false;
  patientId: string | null = null;
  isLoading: boolean = false;

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

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.isEditMode = true;
      this.fetchPatientData(this.patientId);
    }
  }

  fetchPatientData(id: string) {
    this.isLoading = true;
    this.patientService.getPatientById(id).subscribe({
      next: (res: any) => {
        console.log('Fetched patient data:', res);
        if (res) {
          const data = Array.isArray(res) ? res[0] : res;
          this.formData = { ...this.formData, ...data };
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching patient data:', err);
        alert('Failed to load patient data.');
        this.isLoading = false;
      }
    });
  }

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

    const hasAtLeastOneField = Object.values(this.formData).some(value => value && String(value).trim() !== '');

    if (!hasAtLeastOneField) {
      alert('Please fill in at least one field before submitting.');
      return;
    }

    if (this.isEditMode) {
      this.patientService.updatePatient(this.patientId!, this.formData).subscribe({
        next: (res) => {
          alert('Patient updated successfully!');
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update patient');
        }
      });
    } else {
      this.patientService.createPatient(this.formData).subscribe({
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
}
