import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GrantReport, GrantReportRequest } from '../models/grant-report.models';

@Injectable({ providedIn: 'root' })
export class GrantReportApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/grantreport`;

  upsert(req: GrantReportRequest): Observable<GrantReport> {
    return this.http
      .post<GrantReport>(this.base, req)
      .pipe(catchError(this.toError));
  }

  getByApplication(applicationId: number): Observable<GrantReport | null> {
    return this.http
      .get<GrantReport>(`${this.base}/by-application/${applicationId}`,
        { observe: 'response' as const })
      .pipe(
        map(res => res.status === 204 ? null : (res.body ?? null)),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) return of(null);
          return this.toError(err);
        }),
      );
  }

  private toError(err: HttpErrorResponse) {
    const msg = (typeof err.error === 'string' && err.error)
      || err.error?.error
      || err.error?.message
      || (err.error?.errors && Object.values<string[]>(err.error.errors)[0]?.[0])
      || `Request failed (HTTP ${err.status}).`;
    return throwError(() => new Error(msg));
  }
}
