import { Injectable, signal, OnDestroy } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LayoutService implements OnDestroy {
    isSidebarOpen = signal(true);
    isMobile = signal(false);

    private resizeListener: () => void;

    constructor() {
        this.checkScreenSize();

        this.resizeListener = () => this.checkScreenSize();
        window.addEventListener('resize', this.resizeListener);
    }

    checkScreenSize() {
        const isMobileScreen = window.innerWidth < 768; // Bootstrap md breakpoint
        const wasMobile = this.isMobile(); // Get previous state

        this.isMobile.set(isMobileScreen);

        // Only change sidebar state if crossing the breakpoint
        if (isMobileScreen !== wasMobile) {
            if (isMobileScreen) {
                this.isSidebarOpen.set(false); // Close when moving to mobile
            } else {
                this.isSidebarOpen.set(true); // Open when moving to desktop
            }
        } else if (this.isSidebarOpen() === undefined) {
            // Initial load fallback (though signal has initial value, logic here ensures correctness)
            if (isMobileScreen) this.isSidebarOpen.set(false);
        }
    }

    toggleSidebar() {
        this.isSidebarOpen.update(value => !value);
    }

    ngOnDestroy() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
        }
    }
}
