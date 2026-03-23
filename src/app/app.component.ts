import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Navbar } from './navbar/navbar.component';
import { Hero } from './hero/hero-section.component';
import { DestinationsSection } from './destinations/destinations-section.component';
import { Subscription } from 'rxjs';
import { AuthModal } from './auth/auth-modal.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UiToastService } from './shared/ui-toast.service';
import { AppLoaderService } from './shared/app-loader.service';
import { AuthService } from './shared/auth.service';
import { appEnv } from './shared/app-env';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    Navbar,
    Hero,
    DestinationsSection,
    AuthModal,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('task-2');
  isHome = true;
  authMode: 'signin' | 'signup' | null = null;
  contactMessage = '';
  contactStatus = '';
  isRouting = false;
  hideNavbar = false;
  showScrollTop = signal(false);
  readonly toasts;
  readonly loaderVisible;
  readonly socialLinks = appEnv.socialLinks;

  private navSub?: Subscription;

  constructor(
    private router: Router,
    private uiToast: UiToastService,
    private appLoader: AppLoaderService,
    private authService: AuthService,
  ) {
    this.toasts = this.uiToast.toasts;
    this.loaderVisible = this.appLoader.isVisible;
  }

  ngOnInit(): void {
    this.navSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isRouting = true;
        this.appLoader.show();
        this.isHome = this.isHomeRoute(event.url);
        if (event.url === '/signin') {
          this.authMode = 'signin';
        } else if (event.url === '/signup') {
          this.authMode = 'signup';
        }
        this.hideNavbar = this.isFormRoute(event.url);
        return;
      }
      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isRouting = false;
        this.appLoader.hide();
        this.isHome = this.isHomeRoute(this.router.url);
        return;
      }
      if (event instanceof NavigationEnd) {
        const nav = event as NavigationEnd;
        this.isHome = this.isHomeRoute(nav.urlAfterRedirects);
        if (nav.urlAfterRedirects === '/signin') {
          this.authMode = 'signin';
        } else if (nav.urlAfterRedirects === '/signup') {
          this.authMode = 'signup';
        } else {
          this.authMode = null;
        }
        this.hideNavbar = this.isFormRoute(nav.urlAfterRedirects);
        if (nav.urlAfterRedirects === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (nav.urlAfterRedirects === '/destinations') {
          const scrollToDestinations = () => {
            const section = document.getElementById('destinations');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          };
          setTimeout(() => {
            scrollToDestinations();
            window.requestAnimationFrame(scrollToDestinations);
          }, 0);
        } else if (
          nav.urlAfterRedirects !== '/' &&
          nav.urlAfterRedirects !== '/signin' &&
          nav.urlAfterRedirects !== '/signup'
        ) {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
        this.isRouting = false;
        this.appLoader.hide();
      }
    });
    this.isHome = this.isHomeRoute(this.router.url);
    this.hideNavbar = this.isFormRoute(this.router.url);
    this.updateScrollTopVisibility();
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  closeAuth(): void {
    this.authMode = null;
    this.router.navigateByUrl('/');
  }

  onAuthSuccess(): void {
    this.authMode = null;
    const returnUrl = sessionStorage.getItem('auth_return');
    if (returnUrl) {
      sessionStorage.removeItem('auth_return');
      this.router.navigateByUrl(returnUrl);
      return;
    }
    this.router.navigateByUrl('/profiles');
  }

  submitContact(): void {
    if (!this.contactMessage.trim()) {
      this.contactStatus = 'Please add a message before sending.';
      return;
    }

    const currentUser = this.authService.user;
    if (!currentUser || !currentUser.emailVerified) {
      this.contactStatus = 'Please sign in with a verified email before sending a message.';
      this.authMode = 'signin';
      return;
    }

    const subject = encodeURIComponent(`Travel Inquiry from ${currentUser.email}`);
    const body = encodeURIComponent(
      `From: ${currentUser.name}\nEmail: ${currentUser.email}\n\nMessage:\n${this.contactMessage}`,
    );
    window.location.href = `mailto:${appEnv.supportEmail}?subject=${subject}&body=${body}`;
    this.contactStatus = 'Mail draft opened with your verified email details. Please send it from your mail app.';
    this.contactMessage = '';
  }

  closeToast(id: number): void {
    this.uiToast.close(id);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showScrollTop.set(false);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrollTopVisibility();
  }

  private isFormRoute(url: string): boolean {
    return url === '/book-tour' || url === '/signin' || url === '/signup';
  }

  private isHomeRoute(url: string): boolean {
    return url === '/' || url === '/destinations';
  }

  private updateScrollTopVisibility(): void {
    this.showScrollTop.set(window.scrollY > 320);
  }
}
