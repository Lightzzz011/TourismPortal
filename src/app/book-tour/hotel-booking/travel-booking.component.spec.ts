import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBooking } from './travel-booking.component';

describe('HotelBooking', () => {
  let component: HotelBooking;
  let fixture: ComponentFixture<HotelBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
