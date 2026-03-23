import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService, AuthUser } from '../shared/auth.service';
import { appEnv } from '../shared/app-env';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class Navbar implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('linksWrap', { static: true })
  linksWrap!: ElementRef<HTMLElement>;

  private navSub?: Subscription;
  private authSub?: Subscription;
  private resizeHandler = () => this.scheduleSnap();
  private narrowMedia?: MediaQueryList;
  private narrowHandler = (event: MediaQueryListEvent) => {
    this.zone.run(() => this.applyNarrowState(event.matches));
  };

  isCompact = false;
  isMenuOpen = false;
  isReveal = false;
  user: AuthUser | null = null;
  readonly appName = appEnv.appName;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.narrowMedia = window.matchMedia('(max-width: 1030px)');
    this.applyNarrowState(this.narrowMedia.matches);
    this.narrowMedia.addEventListener('change', this.narrowHandler);
  }

  ngAfterViewInit(): void {
    this.scheduleSnap();
    this.navSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isMenuOpen = false;
          return;
        }
        this.scheduleSnap();
      });
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
    this.authSub?.unsubscribe();
    window.removeEventListener('resize', this.resizeHandler);
    this.narrowMedia?.removeEventListener('change', this.narrowHandler);
  }

  get userInitial(): string {
    const source = this.user?.name?.trim() || this.user?.email?.trim() || 'U';
    return source.charAt(0).toUpperCase();
  }

  snapToActive(): void {
    if (!this.linksWrap?.nativeElement) {
      return;
    }
    if (this.isCompact) {
      const wrapStyle = this.linksWrap.nativeElement.style;
      wrapStyle.setProperty('--u-width', '0px');
      return;
    }
    const activeLink = this.getActiveLink();
    if (!activeLink) {
      const wrapStyle = this.linksWrap.nativeElement.style;
      wrapStyle.setProperty('--u-width', '0px');
      return;
    }

    this.setUnderlineToElement(activeLink as HTMLElement);
  }

  private scheduleSnap(): void {
    setTimeout(() => this.snapToActive(), 0);
  }

  private setUnderlineToElement(element: HTMLElement): void {
    if (!this.linksWrap?.nativeElement) {
      return;
    }
    const wrapRect = this.linksWrap.nativeElement.getBoundingClientRect();
    const elRect = element.getBoundingClientRect();

    const left = elRect.left - wrapRect.left;
    const width = elRect.width;

    const wrapStyle = this.linksWrap.nativeElement.style;
    wrapStyle.setProperty('--u-left', `${left}px`);
    wrapStyle.setProperty('--u-width', `${width}px`);
  }

  private applyNarrowState(isNarrow: boolean): void {
    if (isNarrow) {
      if (!this.isCompact) {
        this.isCompact = true;
        this.isMenuOpen = false;
        this.scheduleSnap();
      } else {
        this.isCompact = true;
      }
      this.cdr.markForCheck();
      return;
    }
    if (this.isCompact) {
      this.isCompact = false;
      this.isMenuOpen = false;
      this.scheduleSnap();
      this.cdr.markForCheck();
    }
  }

  private getActiveLink(): HTMLElement | null {
    return this.linksWrap.nativeElement.querySelector('a.active');
  }

  goHome(event: Event): void {
    if (this.router.url !== '/') {
      return;
    }
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.triggerReveal();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  signOut(): void {
    this.authService.signOut();
    this.isMenuOpen = false;
    this.router.navigateByUrl('/');
  }

  openMenu(): void {
    this.isMenuOpen = true;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  private triggerReveal(): void {
    this.isReveal = true;
    window.setTimeout(() => {
      this.isReveal = false;
    }, 450);
  }
}
