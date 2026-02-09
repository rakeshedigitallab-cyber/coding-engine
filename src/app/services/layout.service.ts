import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    isSidebarOpen = signal(true);

    toggleSidebar() {
        this.isSidebarOpen.update(value => !value);
    }
}
