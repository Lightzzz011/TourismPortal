import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AppLoaderService } from './app-loader.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(AppLoaderService);

  loader.show();

  return next(req).pipe(
    finalize(() => {
      loader.hide();
    }),
  );
};
