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
import { LoginComponent } from './components/User/Login/login.component';
import { RegisterComponent } from './components/User/Register/register.component';
import { authGuard, guestGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'codes', component: CodeListComponent, canActivate: [authGuard] },
  { path: 'billing', component: BillingComponent, canActivate: [authGuard] },
  { path: 'patients', component: PatientsListComponent, canActivate: [authGuard] },
  { path: 'new', component: CreatePatientsComponent, canActivate: [authGuard] },
  { path: 'appointment', component: AppointmentComponent, canActivate: [authGuard] },
  { path: 'doctor', component: DoctorListComponent, canActivate: [authGuard] },
  { path: 'doctor-profile/:id', component: DoctorProfileComponent, canActivate: [authGuard] },
  { path: 'edit-patient/:id', component: CreatePatientsComponent, canActivate: [authGuard] },
  { path: 'create-doctor', component: CreateDoctorComponent, canActivate: [authGuard] },
  { path: 'edit-doctor/:id', component: CreateDoctorComponent, canActivate: [authGuard] },
  // Wildcard route for 404
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
