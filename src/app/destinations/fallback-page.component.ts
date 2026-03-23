import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <div
      style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: #888;
    "
    >
      Page under construction
    </div>
  `,
})
export class Placeholder {}
