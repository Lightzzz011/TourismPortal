import { Injectable, signal } from '@angular/core';

export type UiToast = {
  id: number;
  text: string;
  visible: boolean;
  kind: 'default' | 'error';
};

@Injectable({ providedIn: 'root' })
export class UiToastService {
  readonly toasts = signal<UiToast[]>([]);

  private counter = 0;
  private toastTimer: any;

  show(text: string, duration = 4000, kind: 'default' | 'error' = 'default') {
    const nextToast: UiToast = {
      id: ++this.counter,
      text,
      visible: true,
      kind,
    };

    clearTimeout(this.toastTimer);
    this.toasts.set([nextToast]);

    this.toastTimer = setTimeout(() => {
      const current = this.toasts();
      if (!current.length) return;
      this.toasts.set([{ ...current[0], visible: false }]);
      setTimeout(() => this.toasts.set([]), 250);
    }, duration);
  }

  close(id: number) {
    this.toasts.update((items) =>
      items.map((t) => (t.id === id ? { ...t, visible: false } : t)),
    );
    setTimeout(() => {
      this.toasts.update((items) => items.filter((t) => t.id !== id));
    }, 250);
  }
}
