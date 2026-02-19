import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, of, timeout, catchError, throwError } from 'rxjs';

import { API_BASE } from '../api-config';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private http = inject(HttpClient);
    private readonly API_BASE = `${API_BASE}/patients`;

    private patientsSubject = new BehaviorSubject<any[]>([]);
    public patients$ = this.patientsSubject.asObservable();

    private isInitialLoad = true;

    getPatients(forceRefresh: boolean = false): Observable<any[]> {
        if (!this.isInitialLoad && !forceRefresh) {
            return of(this.patientsSubject.value);
        }

        return this.refreshPatients();
    }

    refreshPatients(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_BASE}/view`).pipe(
            map(res => {
                let data: any[] = [];
                if (Array.isArray(res)) data = res;
                else if (res && (res as any).data) data = (res as any).data;
                return data;
            }),
            tap(data => {
                this.patientsSubject.next(data);
                this.isInitialLoad = false;
            })
        );
    }

    getPatientById(id: string): Observable<any> {
        return this.http.get<any>(`${this.API_BASE}/view/${id}`).pipe(
            timeout(10000),
            map(res => {
                if (Array.isArray(res)) return res[0];
                return res?.data || res;
            }),
            catchError(err => {
                console.error('Service error fetching patient:', err);
                return throwError(() => err);
            })
        );
    }

    createPatient(patientData: any): Observable<any> {
        return this.http.post(`${this.API_BASE}/create`, patientData).pipe(
            tap(() => this.refreshPatients().subscribe())
        );
    }

    updatePatient(id: string, patientData: any): Observable<any> {
        return this.http.put(`${this.API_BASE}/update/${id}`, patientData).pipe(
            tap(() => this.refreshPatients().subscribe())
        );
    }

    deletePatient(id: string): Observable<any> {
        return this.http.delete(`${this.API_BASE}/delete/${id}`, { responseType: 'text' }).pipe(
            tap(() => {
                const updatedList = this.patientsSubject.value.filter(p => p.id !== id);
                this.patientsSubject.next(updatedList);
            })
        );
    }

    clearCache() {
        this.isInitialLoad = true;
    }
}
