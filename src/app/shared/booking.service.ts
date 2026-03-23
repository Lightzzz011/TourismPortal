import { Injectable } from '@angular/core';

export type Booking = {
  placeId: string;
  placeName: string;
  hotel: string;
  members: number;
  price: number;
  visitDate: string;
  status: 'booked' | 'visiting-soon';
  createdAt: string;
};

const BOOKINGS_KEY = 'travel_bookings';

@Injectable({ providedIn: 'root' })
export class BookingService {
  loadBookings(): Booking[] {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as Booking[];
    } catch {
      return [];
    }
  }

  saveBooking(booking: Booking): void {
    const bookings = this.loadBookings();
    const next = [booking, ...bookings];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
  }
}
