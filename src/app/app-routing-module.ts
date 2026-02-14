import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CodeListComponent } from './components/code-list/code-list.component';
import { BillingComponent } from './components/billing/billing.component';
import { PatientsComponent } from './components/patients/patients.component';
import { NewPatientsComponent } from './components/new-patients/new-patients.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { DoctorListComponent } from './components/doctor/doctor-list/doctor-list.component';
import { CreateDoctorComponent } from './components/doctor/create-doctor/create-doctor.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'codes', component: CodeListComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'new', component: NewPatientsComponent },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'doctor', component: DoctorListComponent },
  { path: 'new-doctor', component: CreateDoctorComponent },
  // Wildcard route for 404 (optional for now, but good practice)
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
