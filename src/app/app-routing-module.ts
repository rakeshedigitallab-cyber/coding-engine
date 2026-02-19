import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CodeListComponent } from './components/code-list/code-list.component';
import { BillingComponent } from './components/billing/billing.component';
import { PatientsListComponent } from './components/patients/patients-list/patients-list.component';
import { CreatePatientsComponent } from './components/patients/create-patients/create-patients.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { DoctorListComponent } from './components/doctor/doctor-list/doctor-list.component';
import { CreateDoctorComponent } from './components/doctor/create-doctor/create-doctor.component';
import { DoctorProfileComponent } from './components/doctor/doctor-profile/doctor-profile.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'codes', component: CodeListComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'patients', component: PatientsListComponent },
  { path: 'new', component: CreatePatientsComponent },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'doctor', component: DoctorListComponent },
  { path: 'doctor-profile/:id', component: DoctorProfileComponent },
  { path: 'edit-patient/:id', component: CreatePatientsComponent },
  { path: 'create-doctor', component: CreateDoctorComponent },
  { path: 'edit-doctor/:id', component: CreateDoctorComponent },
  // Wildcard route for 404 (optional for now, but good practice)
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
