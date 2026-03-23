import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HotelBooking } from './hotel-booking/travel-booking.component';
import { UiToastService } from '../shared/ui-toast.service';

@Component({
  selector: 'app-book-tour-page',
  standalone: true,
  imports: [CommonModule, HotelBooking],
  templateUrl: './book-tour-page.component.html',
  styleUrls: ['./book-tour-page.component.css'],
})
export class BookTourPage {
  constructor(
    private router: Router,
    private uiToast: UiToastService,
  ) {}

  showToast() {
    this.uiToast.show('Explore top deals for your next journey.', 3000);
  }

  showBookingToast() {
    this.uiToast.show('✅ Booking Confirmed', 4000);
  }

  goToDestinations() {
    this.router.navigateByUrl('/destinations/all');
  }
}
