import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private exclude_array: string[] = ['/login', '/register', '/verifyEmail'
    , '/modifier_pwd', '/nouveau_pwd', '/verifyUser', '/verify'
    , '/update', '/ws', '/pfe/options', '/pfe/futures', '/viewed'
    , '/updateFutures', '/insertAllFutures', '/futuress', '/changePassword'
    , '/check-alerts', '/api','/ticker-details','/pfe/perpetuals'];

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler):
    Observable<HttpEvent<unknown>> {
    if (!this.toExclude(request.url)) {
      let jwt = this.authService.getToken();
      let reqWithToken = request.clone({
        setHeaders: { Authorization: "Bearer " + jwt }
      })
      return next.handle(reqWithToken);
    }
    return next.handle(request);
  }
  toExclude(url: string) {
    var length = this.exclude_array.length;
    for (var i = 0; i < length; i++) {
      if (url.search(this.exclude_array[i]) != -1)
        return true;
    }
    return false;
  }

}
