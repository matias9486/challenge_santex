import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { IS_PUBLIC_API } from "@core/context/auth.context";
import { AuthService } from "@core/services/auth.service";


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {  
  // Si la petición tiene la bandera de ser pública, no agrega token
  if (req.context.get(IS_PUBLIC_API)) {    
    return next(req);
  }

  const token = inject(AuthService).token();  
  // Si hay token, lo agregamos
  if (token) {    
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
    return next(newReq);
  }

  return next(req);
}