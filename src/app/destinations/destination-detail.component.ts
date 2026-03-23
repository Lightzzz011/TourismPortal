import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { places } from '../shared/places';

type UserLocation = {
  label: string;
};

const LOCATION_KEY = 'travel_location';

@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destination-detail.component.html',
  styleUrls: ['./destination-detail.component.css'],
})
export class DestinationDetail implements OnInit, OnDestroy {
  private readonly placeId = signal<string | null>(null);
  private readonly slideIndex = signal(0);
  readonly place = computed(() => {
    const id = this.placeId();
    return places.find((item) => item.id === id) ?? null;
  });
  readonly isLocationPromptOpen = signal(false);
  readonly locationLabel = signal<string | null>(this.loadLocation()?.label ?? null);

  private slideTimer?: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.placeId.set(id);
      this.slideIndex.set(0);
      this.startAutoSlide();
      if (!this.locationLabel()) {
        this.isLocationPromptOpen.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.slideTimer) {
      window.clearInterval(this.slideTimer);
    }
  }

  get currentSlide(): string | null {
    const place = this.place();
    if (!place) {
      return null;
    }
    return place.images[this.slideIndex() % place.images.length];
  }

  nextSlide(): void {
    const place = this.place();
    if (!place) {
      return;
    }
    this.slideIndex.set((this.slideIndex() + 1) % place.images.length);
  }

  prevSlide(): void {
    const place = this.place();
    if (!place) {
      return;
    }
    const next = this.slideIndex() - 1;
    this.slideIndex.set(next < 0 ? place.images.length - 1 : next);
  }

  openLocationPrompt(): void {
    this.isLocationPromptOpen.set(true);
  }

  saveLocation(label: string): void {
    const trimmed = label.trim();
    if (!trimmed) {
      return;
    }
    const location: UserLocation = { label: trimmed };
    localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    this.locationLabel.set(trimmed);
    this.isLocationPromptOpen.set(false);
  }

  closeLocationPrompt(): void {
    this.isLocationPromptOpen.set(false);
  }

  get directionsLink(): string | null {
    const place = this.place();
    const label = this.locationLabel();
    if (!place || !label) {
      return null;
    }
    const destination = `${place.name}, ${place.country}`;
    const origin = encodeURIComponent(label);
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(
      destination,
    )}`;
  }

  get placeLink(): string | null {
    const place = this.place();
    if (!place) {
      return null;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      place.name + ', ' + place.country,
    )}`;
  }

  private startAutoSlide(): void {
    if (this.slideTimer) {
      window.clearInterval(this.slideTimer);
    }
    this.slideTimer = window.setInterval(() => this.nextSlide(), 4500);
  }

  private loadLocation(): UserLocation | null {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as UserLocation;
    } catch {
      return null;
    }
  }
}
