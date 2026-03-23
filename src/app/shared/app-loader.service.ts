import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppLoaderService {
  private readonly pendingCount = signal(0);
  private readonly visible = signal(false);
  private visibleSince = 0;
  private hideTimer?: number;
  private readonly minVisibleMs = 450;

  readonly isVisible = computed(() => this.visible());

  show(): void {
    if (this.hideTimer) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }

    this.pendingCount.update((count) => count + 1);
    if (!this.visible()) {
      this.visibleSince = Date.now();
      this.visible.set(true);
    }
  }

  hide(): void {
    const nextCount = Math.max(0, this.pendingCount() - 1);
    this.pendingCount.set(nextCount);

    if (nextCount > 0) {
      return;
    }

    const elapsed = Date.now() - this.visibleSince;
    const remaining = Math.max(0, this.minVisibleMs - elapsed);

    if (remaining === 0) {
      this.visible.set(false);
      return;
    }

    this.hideTimer = window.setTimeout(() => {
      if (this.pendingCount() === 0) {
        this.visible.set(false);
      }
      this.hideTimer = undefined;
    }, remaining);
  }

  reset(): void {
    this.pendingCount.set(0);
    if (this.hideTimer) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
    this.visible.set(false);
  }
}
