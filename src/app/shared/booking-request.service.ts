import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export type BookingType = 'flight' | 'bus' | 'hotel';

export type BookingTraveller = {
  name: string;
  age: number | string;
  gender: string;
};

export type BookingRequest = {
  bookingType: BookingType;
  item: any;
  travellers: number;
  paymentMethod: string;
  travellerDetails: BookingTraveller[];
  totalAmount: number;
  requestedAt: string;
};

export type BookingResponse = {
  success: boolean;
  bookingId: string;
  message: string;
  request: BookingRequest;
};

export type BookingTestMode =
  | 'success'
  | 'bad-request'
  | 'not-found'
  | 'conflict'
  | 'server-error';

@Injectable({ providedIn: 'root' })
export class BookingRequestService {
  private readonly baseUrl = '/api/bookings';

  constructor(private http: HttpClient) {}

  submitBooking(
    request: BookingRequest,
    mode: BookingTestMode = 'success',
  ): Observable<HttpResponse<BookingResponse>> {
    const url = mode === 'success' ? this.baseUrl : `${this.baseUrl}?mode=${mode}`;
    return this.http.post<BookingResponse>(url, request, {
      observe: 'response',
    });
  }

  listBookings(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.baseUrl, { observe: 'response' });
  }
}
