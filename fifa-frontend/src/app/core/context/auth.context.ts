import { HttpContext, HttpContextToken } from "@angular/common/http";

// Bandera para agregar o no token en peticiones según sea ruta pública o no. Por defecto, asumimos que las rutas REQUIEREN token
export const IS_PUBLIC_API = new HttpContextToken<boolean>(() => false);
// Objeto de configuración, que usaremos en las peticiones que NO requieren autenticación
export const NO_TOKEN_REQUIRED = { context: new HttpContext().set(IS_PUBLIC_API, true)}
