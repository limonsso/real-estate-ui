import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Ajouter les en-têtes pour toutes les requêtes
        request = request.clone({
            setHeaders: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // Gérer les erreurs de certificat
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.error instanceof ErrorEvent) {
                    // Erreur côté client
                    console.error('Erreur côté client:', error.error.message);
                } else {
                    // Erreur côté serveur
                    console.error(`Code d'erreur: ${error.status}, message: ${error.message}`);
                }
                return throwError(() => error);
            })
        );
    }
} 