import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, of, timeout, catchError, throwError } from 'rxjs';

import { API_BASE } from '../api-config';

@Injectable({
    providedIn: 'root'
})
export class DoctorService {
    private http = inject(HttpClient);
    private readonly API_BASE = API_BASE;

    private doctorsSubject = new BehaviorSubject<any[]>([]);
    public doctors$ = this.doctorsSubject.asObservable();

    private isInitialLoad = true;

    getDoctors(forceRefresh: boolean = false): Observable<any[]> {
        if (!this.isInitialLoad && !forceRefresh) {
            return of(this.doctorsSubject.value);
        }

        return this.refreshDoctors();
    }

    refreshDoctors(): Observable<any[]> {
        return this.http.get<any>(`${this.API_BASE}/api/doctors`).pipe(
            map(res => {
                let data: any[] = [];
                if (Array.isArray(res)) data = res;
                else if (res?.data?.content) data = res.data.content;
                else if (res?.data?.data?.content) data = res.data.data.content;
                else if (res?.data) data = res.data;
                else if (res?.content) data = res.content;
                return data;
            }),
            tap(data => {
                this.doctorsSubject.next(data);
                this.isInitialLoad = false;
            })
        );
    }

    deleteDoctor(id: any): Observable<any> {
        return this.http.delete(`${this.API_BASE}/api/doctors/${id}`).pipe(
            tap(() => this.refreshDoctors().subscribe())
        );
    }

    clearCache() {
        this.isInitialLoad = true;
    }

    getDoctorById(id: any): Observable<any> {
        return this.http.get<any>(`${this.API_BASE}/api/doctors/${id}`).pipe(
            timeout(10000), // 10 seconds timeout
            map(res => res?.data || res),
            catchError(err => {
                console.error('Service error fetching doctor:', err);
                return throwError(() => err);
            })
        );
    }
}
