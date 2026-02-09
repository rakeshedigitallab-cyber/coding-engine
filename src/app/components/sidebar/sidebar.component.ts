import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../services/layout.service';

interface MenuItem {
  title: string;
  icon?: string;
  link?: string;
  badge?: { text: string; class: string };
  children?: MenuItem[];
  expanded?: boolean;
  isHeader?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  userName: string = 'Mohan Krishna';
  userEmail: string = 'mohan.krishna@syntax.com';
  userImage: string = 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80';
  isProfileExpanded: boolean = false;

  menuItems: MenuItem[] = [
    { title: 'NAVIGATION', isHeader: true },
    {
      title: 'Dashboard',
      icon: 'fa-solid fa-house',
      expanded: true,
      children: [
        { title: 'Dashboard 1', link: '/dashboard' },
        { title: 'Dashboard 2', link: '/dashboard/v2' }
      ]
    },
    {
      title: 'Code Engine',
      icon: 'fa-solid fa-table-columns',
      children: [
        { title: 'Code List', link: '/dashboard/codes' },
        { title: 'Billing', link: '/dashboard/billing' }
      ]
    },
    {
      title: 'Master',
      icon: 'fa-solid fa-layer-group',
      children: [
        { title: 'Patient', link: '/dashboard/patient' },
        { title: 'Appointment', link: '/dashboard/appointment' },
        { title: 'Doctor', link: '/dashboard/doctor' }
      ]
    },
    {
      title: 'Widgets',
      icon: 'fa-solid fa-gear',
      link: '/widgets',
      badge: { text: '24', class: 'bg-warning text-dark' }
    },
    { title: 'COMPONENTS', isHeader: true },
    {
      title: 'UI Elements',
      icon: 'fa-solid fa-cube',
      children: [
        { title: 'Buttons', link: '/ui/buttons' },
        { title: 'Panels', link: '/ui/panels' }
      ]
    },
    {
      title: 'Forms',
      icon: 'fa-solid fa-pen',
      children: [
        { title: 'General', link: '/forms/general' }
      ]
    },
    {
      title: 'Tables',
      icon: 'fa-solid fa-table',
      children: [
        { title: 'Static Tables', link: '/tables/static' }
      ]
    },
    {
      title: 'Charts',
      icon: 'fa-solid fa-chart-bar',
      children: [
        { title: 'Morris', link: '/charts/morris' }
      ]
    },
    {
      title: 'Miscellaneous',
      icon: 'fa-solid fa-screwdriver-wrench',
      children: [
        { title: 'Timeline', link: '/misc/timeline' }
      ]
    },
    {
      title: 'Grid System',
      icon: 'fa-solid fa-border-all',
      children: [
        { title: 'Grid', link: '/grid' }
      ]
    },
    { title: 'MORE', isHeader: true },
    {
      title: 'App Views',
      icon: 'fa-solid fa-display',
      children: [
        { title: 'Contacts', link: '/apps/files' },
        { title: 'Profile', link: '/apps/profile' },
        { title: 'Privacy', link: '/apps/privacy' },
        { title: 'Issue Tracker', link: '/apps/issue-tracker' },
        { title: 'Blog', link: '/apps/blog' },
        { title: 'Outlook', link: '/apps/outlook' },
        { title: 'Vote', link: '/apps/vote' },
        { title: 'Participants', link: '/apps/participants' }
      ]
    },
    {
      title: 'Blog Apps',
      icon: 'fa-solid fa-blog',
      children: [
        { title: 'New Article', link: '/blog/new' },
        { title: 'Manage', link: '/blog/manage' }
      ]
    },
    {
      title: 'Email',
      icon: 'fa-solid fa-envelope',
      children: [
        { title: 'Inbox', link: '/email/inbox' },
        { title: 'Compose', link: '/email/compose' }
      ]
    },
    {
      title: 'Other Pages',
      icon: 'fa-solid fa-file-lines',
      children: [
        { title: 'Invoice', link: '/pages/invoice' },
        { title: 'Profile', link: '/pages/profile' }
      ]
    },
    {
      title: 'Gallery',
      icon: 'fa-solid fa-image',
      children: [{ title: 'Album', link: '/gallery/album' }]
    },
    {
      title: 'Menu Level',
      icon: 'fa-solid fa-sitemap',
      children: [{ title: 'Level 1', link: '/menu/level1' }]
    },
    { title: 'EXTRAS', isHeader: true },
    {
      title: 'Icons Pack',
      icon: 'fa-solid fa-icons',
      children: [{ title: 'Font Awesome', link: '/icons/fa' }]
    },
    {
      title: 'PREMIUM ICONS',
      icon: 'fa-solid fa-crown',
      badge: { text: 'BEST', class: 'bg-danger text-white' },
      link: '/premium-icons'
    },
    {
      title: 'Helper Classes',
      icon: 'fa-solid fa-circle-info',
      link: '/helper-classes'
    }
  ];

  constructor(public layoutService: LayoutService) { }

  toggle(item: MenuItem) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }
}
