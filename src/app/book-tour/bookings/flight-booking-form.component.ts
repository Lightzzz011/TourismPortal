import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { finalize, take } from 'rxjs/operators';
import { BookingRequestService } from '../../shared/booking-request.service';
import { Subscription } from 'rxjs';
import { UiToastService } from '../../shared/ui-toast.service';
import { Booking, BookingService } from '../../shared/booking.service';

@Component({
  selector: 'app-flight-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-booking-form.component.html',
  styleUrls: ['./flight-booking-form.component.css'],
})
export class FlightBookingFormComponent implements OnChanges {
  @Input() bookingType!: 'flight' | 'bus' | 'hotel';
  @Input() item: any;
  @Input() travellers!: number;

  @Output() bookingFinished = new EventEmitter<boolean>();

  travellersArray: any[] = [];
  paymentMethod = 'upi';
  showConfirmation = false;
  travellerErrors: any[] = [];
  isClosing = false;
  isSubmitting = false;
  private submitSub?: Subscription;

  constructor(
    private bookingRequestService: BookingRequestService,
    private uiToast: UiToastService,
    private bookingService: BookingService,
  ) {}

  ngOnChanges() {
    const count = Math.max(1, Number(this.travellers) || 1);
    this.travellersArray = Array.from({ length: count }, () => ({
      name: '',
      age: '',
      gender: 'Male',
    }));
  }

  confirmBooking() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const payload = {
      bookingType: this.bookingType,
      item: this.item,
      travellers: this.travellers,
      paymentMethod: this.paymentMethod,
      travellerDetails: this.travellersArray,
      totalAmount: this.totalAmount,
      requestedAt: new Date().toISOString(),
    };

    this.submitSub = this.bookingRequestService
      .submitBooking(payload)
      .pipe(
        take(1),
        finalize(() => {
          this.isSubmitting = false;
          this.submitSub = undefined;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status !== 200) {
            this.showConfirmation = false;
            this.uiToast.show(this.getFriendlyErrorMessage(response.status), 3500, 'error');
            return;
          }

          this.persistBookingForAnalytics();
          this.showConfirmation = false;
          this.uiToast.show('Booking confirmed successfully.', 3000);
          this.isClosing = true;
          setTimeout(() => {
            this.bookingFinished.emit(true);
          }, 250);
        },
        error: (error: HttpErrorResponse) => {
          this.showConfirmation = false;
          this.uiToast.show(this.getFriendlyErrorMessage(error.status), 3500, 'error');
        },
      });
  }

  get totalAmount(): number {
    if (!this.item) return 0;
    if (this.bookingType === 'flight') return this.item.price * this.travellers;
    if (this.bookingType === 'bus') return this.item.price * this.travellers;
    if (this.bookingType === 'hotel') return this.item.price;
    return 0;
  }

  submitBooking() {
    this.travellerErrors = [];

    if (this.bookingType === 'hotel') {
      this.showConfirmation = true;
      return;
    }

    let hasError = false;

    this.travellersArray.forEach((t, index) => {
      const errors: any = {};

      if (!t.name?.trim()) {
        errors.name = 'Name required';
        hasError = true;
      }

      if (!t.age || t.age <= 0) {
        errors.age = 'Valid age required';
        hasError = true;
      }

      this.travellerErrors[index] = errors;
    });

    if (hasError) return;
    this.showConfirmation = true;
  }

  closeForm() {
    this.bookingFinished.emit();
  }

  cancelBooking() {
    if (this.submitSub) {
      this.submitSub.unsubscribe();
      this.submitSub = undefined;
    }
    this.isSubmitting = false;
    this.showConfirmation = false;
  }

  private getFriendlyErrorMessage(status: number): string {
    if (status === 400) return 'Please check your booking details and try again.';
    if (status === 404) return 'Requested booking resource was not found.';
    if (status === 409) return 'This booking conflicts with an existing booking.';
    if (status === 500) return 'Server error occurred. Please try again in a moment.';
    if (status === 0) return 'Network issue detected. Check connection and retry.';
    return 'Booking could not be completed. Please try again.';
  }

  private persistBookingForAnalytics(): void {
    const now = new Date();
    const sourceDate = this.item?.departDate || this.item?.checkIn || now.toISOString();
    const visitDate = this.normalizeDateValue(sourceDate, now);
    const visitTime = new Date(visitDate).getTime();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const destination = this.pickDestinationName();
    const provider = this.pickProviderName();
    const normalizedPlaceId = destination.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const booking: Booking = {
      placeId: normalizedPlaceId || `place-${Date.now()}`,
      placeName: destination,
      hotel: provider,
      members: Math.max(1, Number(this.travellers) || 1),
      price: Math.max(0, Number(this.totalAmount) || 0),
      visitDate,
      status: visitTime >= todayStart ? 'visiting-soon' : 'booked',
      createdAt: now.toISOString(),
    };

    this.bookingService.saveBooking(booking);
  }

  private pickDestinationName(): string {
    if (this.bookingType === 'flight') {
      return this.item?.to || this.item?.destination || this.item?.routeTo || 'Flight Destination';
    }
    if (this.bookingType === 'bus') {
      return this.item?.to || this.item?.destination || 'Bus Destination';
    }
    return this.item?.location || this.item?.city || this.item?.name || this.item?.hotelName || 'Hotel Stay';
  }

  private pickProviderName(): string {
    if (this.bookingType === 'flight') {
      return this.item?.airline || this.item?.operator || 'Flight Provider';
    }
    if (this.bookingType === 'bus') {
      return this.item?.operator || 'Bus Provider';
    }
    return this.item?.name || this.item?.hotelName || 'Hotel Provider';
  }

  private normalizeDateValue(value: string, fallback: Date): string {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return fallback.toISOString();
    }
    return parsed.toISOString();
  }
}
