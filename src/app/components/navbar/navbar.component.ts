import { Component, OnInit, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LayoutService } from '../../services/layout.service';
import { API_BASE } from '../../api-config';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  unreadCount: number = 0;
  notifications: any[] = [];
  isNotificationOpen: boolean = false;

  // NOTE: Apna actual logged-in user ID yahan add karein (Example: 1)
  userId: number = 1;
  private pollingSub!: Subscription;

  constructor(
    public layoutService: LayoutService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.fetchNotifications();

    // Polling every 5 seconds for live real-time notifications update
    this.pollingSub = interval(5000).subscribe(() => {
      this.fetchNotifications();
    });
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  toggle() {
    this.layoutService.toggleSidebar();
  }

  toggleNotifications(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close the dropdown if click is outside of the notification area
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#notificationDropdown') && !targetElement.closest('.dropdown-menu')) {
      this.isNotificationOpen = false;
    }
  }

  fetchNotifications() {
    // Backend se unread count lana: GET /notifications/count/{userId}
    this.http.get<number>(`${API_BASE}/notifications/count/${this.userId}`).subscribe({
      next: (count) => {
        this.unreadCount = count;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching notification count:', err)
    });

    this.http.get<any[]>(`${API_BASE}/notifications/${this.userId}`).subscribe({
      next: (data) => {
        this.notifications = data.map(n => ({
          ...n,
          isRead: n.read === true || n.isRead === true || n.readStatus === true
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching notifications:', err)
    });
  }

  markAsRead(notification: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const isUnread = notification.read === false || notification.isRead === false || notification.readStatus === false;

    if (isUnread || !notification.readStatus) {
      // Temporarily mark true on frontend
      notification.isRead = true;
      notification.read = true;
      notification.readStatus = true;

      if (this.unreadCount > 0) {
        this.unreadCount--;
      }

      this.http.put(`${API_BASE}/notifications/read/${notification.id}`, {}).subscribe({
        next: () => console.log('Notification permanently marked as read on backend'),
        error: (err) => console.error('Error marking notification as read. Did you add the PUT endpoint?', err)
      });
    }
  }

  // ==== Swipe to Remove Functionality ====
  swipeStartX: number = 0;
  activeSwipeId: any = null;
  swipingItemTransform: { [key: string]: string } = {};

  onSwipeStart(event: MouseEvent | TouchEvent, notification: any) {
    // Optional: if (!notification.isRead) return; // Only read msgs can be swiped
    this.activeSwipeId = notification.id;
    this.swipeStartX = this.getClientX(event);
    this.swipingItemTransform[notification.id] = `translateX(0px)`;
  }

  onSwipeMove(event: MouseEvent | TouchEvent, notification: any) {
    if (this.activeSwipeId !== notification.id) return;

    // Prevent default scrolling on mobile while swiping horizontally
    if (event instanceof TouchEvent && Math.abs(this.getClientX(event) - this.swipeStartX) > 10) {
      event.preventDefault();
    }

    const currentX = this.getClientX(event);
    const diffX = currentX - this.swipeStartX;
    this.swipingItemTransform[notification.id] = `translateX(${diffX}px)`;
  }

  onSwipeEnd(event: MouseEvent | TouchEvent, notification: any) {
    if (this.activeSwipeId !== notification.id) return;

    const currentX = this.getClientX(event);
    const diffX = currentX - this.swipeStartX;

    // If swiped left or right more than 80px, remove it
    if (Math.abs(diffX) > 80) {
      this.swipingItemTransform[notification.id] = `translateX(${diffX > 0 ? 400 : -400}px)`;

      // Delay removal for 300ms so animation completes
      setTimeout(() => {
        this.removeNotification(notification);
      }, 300);
    } else {
      // Snap back if swipe wasn't far enough
      this.swipingItemTransform[notification.id] = `translateX(0px)`;
    }

    this.activeSwipeId = null;
  }

  getClientX(event: MouseEvent | TouchEvent): number {
    if (window.TouchEvent && event instanceof TouchEvent) {
      return event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0;
    }
    return (event as MouseEvent).clientX;
  }

  removeNotification(notification: any) {
    // 1. Instantly remove from the frontend UI
    this.notifications = this.notifications.filter(n => n.id !== notification.id);

    // 2. Call the newly added backend API to remove permanently
    this.http.put(`${API_BASE}/notifications/remove/${notification.id}`, {}).subscribe({
      next: () => console.log(`Notification ${notification.id} removed from backend`),
      error: (err) => console.error('Error removing notification', err)
    });
  }
}

