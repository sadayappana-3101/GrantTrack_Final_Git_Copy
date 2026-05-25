import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FinanceDisbursementInfo } from '../models/finance.models';

@Injectable({ providedIn: 'root' })
export class ApplicationDisbursementsService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  list(applicationId: number): Observable<FinanceDisbursementInfo[]> {
    return this.http
      .get<FinanceDisbursementInfo[]>(`${this.base}/applications/${applicationId}/disbursements`)
      .pipe(catchError(this.toError));
  }

  private toError(err: HttpErrorResponse) {
    const msg = (typeof err.error === 'string' && err.error)
      || err.error?.error
      || err.error?.message
      || `Request failed (HTTP ${err.status}).`;
    return throwError(() => new Error(msg));
  }
}
