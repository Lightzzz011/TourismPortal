import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('imageTrack', { static: true })
  imageTrack!: ElementRef<HTMLElement>;

  @ViewChild('heroContainer', { static: true })
  heroContainer!: ElementRef<HTMLElement>;

  private intervalId?: number;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.syncBackground();
    this.intervalId = window.setInterval(() => this.slideOnce(), 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  scrollToDestinations(): void {
    const scrollToSection = () => {
      const section = document.getElementById('destinations');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (this.router.url === '/destinations') {
      scrollToSection();
      return;
    }

    this.router.navigateByUrl('/destinations').then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToSection);
      });
    });
  }

  private slideOnce(): void {
    const track = this.imageTrack.nativeElement;
    const firstImage = track.querySelector('img');
    if (!firstImage) {
      return;
    }

    const firstRect = firstImage.getBoundingClientRect();
    const gapValue = window.getComputedStyle(track).gap;
    const gap = gapValue ? Number.parseFloat(gapValue) : 0;
    const step = firstRect.width + gap;

    track.style.transition = 'transform 0.8s ease';
    track.style.transform = `translateX(-${step}px)`;

    const handleTransitionEnd = () => {
      track.removeEventListener('transitionend', handleTransitionEnd);
      track.appendChild(firstImage);
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
      void track.offsetHeight;
      track.style.transition = 'transform 0.8s ease';
      this.syncBackground();
    };

    track.addEventListener('transitionend', handleTransitionEnd);
  }

  private syncBackground(): void {
    const track = this.imageTrack.nativeElement;
    const images = Array.from(track.querySelectorAll('img'));
    const firstImage = images[0];
    if (!firstImage) {
      return;
    }

    images.forEach((image, index) => {
      image.classList.toggle('tour-image--primary', index === 0);
      image.classList.toggle('tour-image--secondary', index !== 0);
    });

    const src = (firstImage as HTMLImageElement).src;
    this.heroContainer.nativeElement.style.setProperty(
      '--hero-bg',
      `url("${src}")`,
    );
  }
}
