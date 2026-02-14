import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AppointBillingComponent } from '../appoint-billing/appoint-billing.component';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, AppointBillingComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css',
})
export class AppointmentComponent implements OnInit {
  activeTab: string = 'APPOINTMENT';
  patientId: string = '';
  patientData = { firstName: '', cellPhone: '' };

  formData = {
    reason: '',
    appointmentDate: '',
    time: '',
    ampm: 'AM',
    department: '',
    doctorName: '',
    status: '',
    duration: 15,
    notes: '',
    recurring: false,
    followup: false,
    showReminders: false,
    contactTypes: [] as string[]
  };

  appointmentTypes = [
    "Appointment",
    "Video Visit",
    "Break",
    "Walk-in",
    "Transition of Care",
    "New Patient",
    "Referral",
  ];

  doctors = [
    { name: "Dr. A Kumar", category: "Neurologist" },
    { name: "Dr. B Sharma", category: "Neurologist" },
    { name: "Dr. C Mehta", category: "Cardiologist" },
    { name: "Dr. D Reddy", category: "Oncologist" },
    { name: "Dr. E Verma", category: "Orthopedic" },
    { name: "Dr. F Patel", category: "Orthopedic" },
  ];

  filteredDoctors: any[] = [];
  timeOptions: string[] = [];
  disabledTimes: string[] = [];

  private debounceTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.generateTimeOptions();
  }

  generateTimeOptions() {
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const h = hour.toString().padStart(2, "0");
        const m = minute.toString().padStart(2, "0");
        this.timeOptions.push(`${h}:${m}`);
      }
    }
  }

  onPatientIdChange() {
    if (!this.patientId) {
      this.patientData = { firstName: '', cellPhone: '' };
      return;
    }

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.fetchPatientData();
    }, 500);
  }

  fetchPatientData() {
    this.http.get<any>(`http://128.199.27.135:8081/patients/view/${this.patientId}`)
      .subscribe({
        next: (data) => {
          this.patientData = data;
          console.log("Patient Data fetched:", data);
        },
        error: (err) => {
          console.error("Error fetching patient data:", err);
          this.patientData = { firstName: '', cellPhone: '' };
        }
      });
  }

  onDepartmentChange() {
    if (this.formData.department) {
      this.filteredDoctors = this.doctors.filter(doc => doc.category === this.formData.department);
      this.formData.doctorName = ''; // Reset doctor selection
    } else {
      this.filteredDoctors = [];
    }
  }

  onDateChange() {
    if (this.formData.appointmentDate) {
      this.fetchBookedTimes(this.formData.appointmentDate);
    }
  }

  fetchBookedTimes(date: string) {
    this.http.get<string[]>(`http://128.199.27.135:8081/appointments/booked-times/${date}`)
      .subscribe({
        next: (data) => {
          this.disabledTimes = data.map((time: string) => {
            const [hour, minute] = time.split(":");
            return `${hour.padStart(2, '0')}:${minute}`; // Just ensuring format matches
          });
        },
        error: (err) => console.error("Error fetching booked times:", err)
      });
  }

  convertTo24Hour(time: string, ampm: string): string {
    if (!time) return "";
    let [h, m] = time.split(":").map(Number);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  isTimeDisabled(time: string): boolean {
    const time24 = this.convertTo24Hour(time, this.formData.ampm); // This logic might need adjustment based on how backend returns booked times (usually 24h)
    // Assuming backend returns 24h format HH:mm
    // But since the dropdown shows 12h format, we need to compare properly.
    // The booked times are likely stored in 24h format.
    // Let's assume disabledTimes contains 24h strings.
    return this.disabledTimes.includes(time24);
  }

  toggleContactType(type: string, event: any) {
    const value = type.toLowerCase().replace(" ", "-");
    if (event.target.checked) {
      this.formData.contactTypes.push(value);
    } else {
      const index = this.formData.contactTypes.indexOf(value);
      if (index > -1) {
        this.formData.contactTypes.splice(index, 1);
      }
    }
  }

  createAppointment() {
    if (!this.formData.appointmentDate || !this.formData.time) {
      alert("Please select both date and time.");
      return;
    }

    const time24 = this.convertTo24Hour(this.formData.time, this.formData.ampm);

    const finalData = {
      ...this.formData,
      appointmentTime: time24,
      patientId: this.patientId
    };

    // Note: The original React code posted to appointments/create/${patientId}
    this.http.post(`http://128.199.27.135:8081/appointments/create/${this.patientId}`, finalData)
      .subscribe({
        next: (res) => {
          console.log("Appointment created:", res);
          alert("Appointment successfully created");
          // Optionally navigate away or reset form
        },
        error: (err) => {
          console.error("Error creating appointment:", err);
          alert("Failed to create appointment");
        }
      });
  }

  cancel() {
    // Navigate back or to a default route
    this.router.navigate(['/']);
  }
}
