import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { Booking, BookingService } from '../shared/booking.service';

type StatusTone = 'booked' | 'visiting-soon' | 'completed' | 'neutral';

type StatusCard = {
  label: string;
  count: number;
  percentage: number;
  tone: StatusTone;
};

type DestinationPopularity = {
  placeId: string;
  placeName: string;
  bookings: number;
  popularityPct: number;
};

type RevenueCard = {
  label: string;
  value: string;
  hint: string;
};

type DestinationRevenue = {
  placeId: string;
  placeName: string;
  revenue: number;
  bookings: number;
  sharePct: number;
};

type MonthlyRevenue = {
  label: string;
  revenue: number;
  bookings: number;
};

type AdminTask = {
  title: string;
  detail: string;
  status: string;
};

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePage implements OnInit {
  name = '';
  email = '';
  phone = '';
  submitted = false;
  saveMessage = '';
  errorMessage = '';
  weekLabels = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  calendarDays: Array<{ day: number | null; isToday: boolean }> = [];

  upcomingTrips: Array<{
    title: string;
    location: string;
    duration: string;
    rating: string;
    image: string;
  }> = [];

  popularResorts = [
    {
      name: 'Centara Mirage',
      location: 'Dubai, UAE',
      price: 'from 3,500 AED',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Atlantis The Palm',
      location: 'Jumeirah, Dubai',
      price: 'from 4,000 AED',
      image:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  myTrips: Array<{
    status: string;
    destination: string;
    location: string;
    image: string;
  }> = [];
  analyticsStatusCards: StatusCard[] = [];
  destinationPopularity: DestinationPopularity[] = [];
  mostBookedLocations: DestinationPopularity[] = [];
  totalBookings = 0;
  totalDestinations = 0;
  totalRevenue = 0;
  revenueCards: RevenueCard[] = [];
  revenueByDestination: DestinationRevenue[] = [];
  monthlyRevenueSummary: MonthlyRevenue[] = [];
  todayAdminTasks: AdminTask[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.user;
    if (!user) {
      this.router.navigateByUrl('/signin');
      return;
    }

    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone ?? '';
    const bookings = this.bookingService.loadBookings();
    this.upcomingTrips = this.buildUpcomingTrips(bookings);
    this.myTrips = this.buildVisitedTrips(bookings);
    this.buildAnalytics(bookings);
    this.buildRevenueInsights(bookings);
    this.calendarDays = this.buildCalendarDays();
  }

  get currentMonthLabel(): string {
    const today = new Date();
    return today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  get avatarInitial(): string {
    const source = this.name.trim() || this.email.trim() || 'U';
    return source.charAt(0).toUpperCase();
  }

  get bookingStatusPieStyle(): string {
    const booked = this.findStatusPercentage('Booked');
    const visitingSoon = this.findStatusPercentage('Visiting Soon');
    const bookedEnd = booked;
    const visitingEnd = booked + visitingSoon;
    return `conic-gradient(
      #06b6d4 0% ${bookedEnd}%,
      #f59e0b ${bookedEnd}% ${visitingEnd}%,
      #64748b ${visitingEnd}% 100%
    )`;
  }

  get todayLabel(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  get isAdmin(): boolean {
    return this.authService.user?.role === 'admin';
  }

  get nameError(): string {
    if (!this.submitted) return '';
    if (!this.name.trim()) return 'Name is required';
    if (this.name.trim().length < 2) return 'Name is too short';
    return '';
  }

  get emailError(): string {
    if (!this.submitted) return '';
    if (!this.email.trim()) return 'Email is required';
    if (!this.isValidEmail(this.email)) return 'Invalid email format';
    return '';
  }

  get phoneError(): string {
    if (!this.submitted) return '';
    if (this.phone.trim() && !this.isValidPhone(this.phone)) {
      return 'Phone must be 10 to 15 digits';
    }
    return '';
  }

  saveProfile(): void {
    this.submitted = true;
    this.saveMessage = '';
    this.errorMessage = '';

    if (!this.isFormValid()) {
      return;
    }

    const response = this.authService.updateProfile({
      name: this.name,
      email: this.email,
      phone: this.phone,
    });
    if (!response.ok) {
      this.errorMessage = response.error ?? 'Profile update failed.';
      return;
    }

    this.saveMessage = 'Profile updated successfully.';
  }

  logout(): void {
    this.authService.signOut();
    this.router.navigateByUrl('/');
  }

  private isFormValid(): boolean {
    return !this.nameError && !this.emailError && !this.phoneError;
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  private isValidPhone(value: string): boolean {
    return /^\+?[0-9]{10,15}$/.test(value.trim());
  }

  private buildCalendarDays(): Array<{ day: number | null; isToday: boolean }> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: Array<{ day: number | null; isToday: boolean }> = [];

    for (let i = 0; i < firstDay; i++) {
      result.push({ day: null, isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      result.push({ day, isToday: day === now.getDate() });
    }

    while (result.length % 7 !== 0) {
      result.push({ day: null, isToday: false });
    }

    return result;
  }

  private buildAnalytics(bookings: Booking[]): void {
    const todayStart = this.startOfToday();
    let visitingSoonCount = 0;
    let completedCount = 0;
    let totalDemandUnits = 0;
    const placeCounter = new Map<string, DestinationPopularity>();

    for (const booking of bookings) {
      const units = this.bookingUnits(booking);
      totalDemandUnits += units;
      const visitDate = this.parseBookingDate(booking);
      if (visitDate !== null && visitDate < todayStart) {
        completedCount += 1;
      } else {
        visitingSoonCount += 1;
      }

      const placeName = (booking.placeName || 'Unknown Destination').trim();
      const placeId = (booking.placeId || placeName).trim().toLowerCase();
      const existing = placeCounter.get(placeId);

      if (existing) {
        existing.bookings += units;
      } else {
        placeCounter.set(placeId, {
          placeId,
          placeName,
          bookings: units,
          popularityPct: 0,
        });
      }
    }

    this.totalBookings = bookings.length;
    this.totalDestinations = placeCounter.size;
    this.analyticsStatusCards = [
      {
        label: 'Booked',
        count: totalDemandUnits,
        percentage: this.percent(totalDemandUnits, totalDemandUnits),
        tone: 'booked',
      },
      {
        label: 'Visiting Soon',
        count: visitingSoonCount,
        percentage: this.percent(visitingSoonCount, this.totalBookings),
        tone: 'visiting-soon',
      },
      {
        label: 'Completed',
        count: completedCount,
        percentage: this.percent(completedCount, this.totalBookings),
        tone: 'completed',
      },
      {
        label: 'Destinations',
        count: this.totalDestinations,
        percentage: this.percent(this.totalDestinations, this.totalBookings),
        tone: 'neutral',
      },
    ];

    this.destinationPopularity = Array.from(placeCounter.values())
      .sort((a, b) => b.bookings - a.bookings || a.placeName.localeCompare(b.placeName))
      .map((item) => ({
        ...item,
        popularityPct: this.percent(item.bookings, totalDemandUnits),
      }));

    this.mostBookedLocations = this.destinationPopularity.slice(0, 5);
  }

  private bookingUnits(booking: Booking): number {
    const members = Number(booking.members);
    if (!Number.isFinite(members) || members <= 0) {
      return 1;
    }
    return Math.floor(members);
  }

  private percent(value: number, total: number): number {
    if (!total) {
      return 0;
    }
    return Number(((value / total) * 100).toFixed(1));
  }

  private startOfToday(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }

  barWidth(percentage: number): number {
    if (percentage <= 0) {
      return 4;
    }
    return Math.max(8, Math.min(100, percentage));
  }

  revenueWidth(revenue: number): number {
    if (!this.totalRevenue) {
      return 4;
    }
    return this.barWidth((revenue / this.totalRevenue) * 100);
  }

  private findStatusPercentage(label: string): number {
    const card = this.analyticsStatusCards.find((item) => item.label === label);
    return card?.percentage ?? 0;
  }

  private buildUpcomingTrips(bookings: Booking[]) {
    const today = new Date();
    const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const images = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80',
    ];

    return bookings
      .filter((booking) => {
        const date = this.parseBookingDate(booking);
        return date !== null && date >= dayStart;
      })
      .sort((a, b) => {
        const aTime = this.parseBookingDate(a) ?? 0;
        const bTime = this.parseBookingDate(b) ?? 0;
        return aTime - bTime;
      })
      .slice(0, 6)
      .map((booking, index) => ({
        title: booking.placeName,
        location: booking.hotel,
        duration: this.bookingDateLabel(booking),
        rating: `${booking.members} traveller${booking.members > 1 ? 's' : ''}`,
        image: images[index % images.length],
      }));
  }

  private bookingDateLabel(booking: Booking): string {
    const date = this.parseBookingDate(booking);
    if (date === null) {
      return 'Date not available';
    }
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private parseBookingDate(booking: Booking): number | null {
    const source = booking.visitDate || booking.createdAt;
    if (!source) {
      return null;
    }
    const date = new Date(source);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }

  private buildVisitedTrips(bookings: Booking[]) {
    const today = new Date();
    const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const images = [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80',
    ];

    return bookings
      .filter((booking) => {
        const date = this.parseBookingDate(booking);
        return date !== null && date < dayStart;
      })
      .sort((a, b) => {
        const aTime = this.parseBookingDate(a) ?? 0;
        const bTime = this.parseBookingDate(b) ?? 0;
        return bTime - aTime;
      })
      .slice(0, 5)
      .map((booking, index) => ({
        status: 'Trip Completed & Visited',
        destination: booking.placeName,
        location: booking.hotel,
        image: images[index % images.length],
      }));
  }

  private buildRevenueInsights(bookings: Booking[]): void {
    const revenueByDestination = new Map<string, DestinationRevenue>();
    const monthlyRevenue = new Map<string, MonthlyRevenue>();
    let totalRevenue = 0;

    for (const booking of bookings) {
      const revenue = Math.max(0, Number(booking.price) || 0);
      totalRevenue += revenue;

      const placeName = (booking.placeName || 'Unknown Destination').trim();
      const placeId = (booking.placeId || placeName).trim().toLowerCase();
      const destinationEntry = revenueByDestination.get(placeId);

      if (destinationEntry) {
        destinationEntry.revenue += revenue;
        destinationEntry.bookings += 1;
      } else {
        revenueByDestination.set(placeId, {
          placeId,
          placeName,
          revenue,
          bookings: 1,
          sharePct: 0,
        });
      }

      const sourceDate = this.parseBookingDate(booking) ?? this.startOfToday();
      const date = new Date(sourceDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const monthlyEntry = monthlyRevenue.get(monthKey);

      if (monthlyEntry) {
        monthlyEntry.revenue += revenue;
        monthlyEntry.bookings += 1;
      } else {
        monthlyRevenue.set(monthKey, {
          label,
          revenue,
          bookings: 1,
        });
      }
    }

    this.totalRevenue = totalRevenue;
    this.revenueByDestination = Array.from(revenueByDestination.values())
      .sort((a, b) => b.revenue - a.revenue || a.placeName.localeCompare(b.placeName))
      .map((entry) => ({
        ...entry,
        sharePct: this.percent(entry.revenue, totalRevenue),
      }));

    this.monthlyRevenueSummary = Array.from(monthlyRevenue.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, summary]) => summary);

    this.revenueCards = [
      {
        label: 'Total Revenue Generated',
        value: this.formatCurrency(totalRevenue),
        hint: `${bookings.length} booking${bookings.length === 1 ? '' : 's'} processed`,
      },
      {
        label: 'Revenue Per Destination',
        value: `${this.revenueByDestination.length} destinations`,
        hint: this.revenueByDestination.length
          ? `${this.revenueByDestination[0].placeName} leads with ${this.formatCurrency(this.revenueByDestination[0].revenue)}`
          : 'No destination revenue yet',
      },
      {
        label: 'Monthly Revenue Summary',
        value: this.monthlyRevenueSummary.length
          ? this.formatCurrency(this.monthlyRevenueSummary[this.monthlyRevenueSummary.length - 1].revenue)
          : this.formatCurrency(0),
        hint: this.monthlyRevenueSummary.length
          ? `${this.monthlyRevenueSummary[this.monthlyRevenueSummary.length - 1].label} latest month`
          : 'No monthly revenue yet',
      },
    ];

    this.todayAdminTasks = this.buildTodayAdminTasks(bookings);
  }

  private buildTodayAdminTasks(bookings: Booking[]): AdminTask[] {
    const todayStart = this.startOfToday();
    const todayBookings = bookings.filter((booking) => this.parseBookingDate(booking) === todayStart);
    const upcomingCount = bookings.filter((booking) => {
      const bookingDate = this.parseBookingDate(booking);
      return bookingDate !== null && bookingDate >= todayStart;
    }).length;

    return [
      {
        title: 'Review today bookings',
        detail: todayBookings.length
          ? `${todayBookings.length} trip${todayBookings.length === 1 ? '' : 's'} scheduled for ${this.todayLabel}.`
          : `No check-ins or departures scheduled for ${this.todayLabel}.`,
        status: todayBookings.length ? 'In queue' : 'Clear',
      },
      {
        title: 'Monitor destination revenue',
        detail: this.revenueByDestination.length
          ? `${this.revenueByDestination[0].placeName} is the top earning destination right now.`
          : 'Revenue board is empty until new bookings arrive.',
        status: this.revenueByDestination.length ? 'Track' : 'Waiting',
      },
      {
        title: 'Follow up on upcoming travellers',
        detail: `${upcomingCount} active booking${upcomingCount === 1 ? '' : 's'} need reminder and support visibility.`,
        status: upcomingCount ? 'Pending' : 'Done',
      },
    ];
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
}
