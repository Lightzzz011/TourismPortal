import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Place, places } from '../shared/places';

@Component({
  selector: 'app-destinations-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destinations-section.component.html',
  styleUrls: ['./destinations-section.component.css'],
})
export class DestinationsSection {
  readonly cards: Place[] = places.slice(0, 6);

  scrollToContact(): void {
    const section = document.getElementById('contact');
    if (!section) {
      return;
    }
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
