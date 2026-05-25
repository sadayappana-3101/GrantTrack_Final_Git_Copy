import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, filter, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppDocument } from '../models/document.models';

export interface UploadProgress {
  kind: 'progress';
  percent: number; 
}
export interface UploadComplete {
  kind: 'complete';
  document: AppDocument;
}

export type UploadEvent = UploadProgress | UploadComplete;

@Injectable({ providedIn: 'root' })
export class DocumentApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  /** GET list. */
  list(applicationId: number): Observable<AppDocument[]> {
    return this.http
      .get<AppDocument[]>(`${this.base}/applications/${applicationId}/documents`)
      .pipe(catchError(this.toError));
  }
  /*POST upload*/
  upload(applicationId: number, file: File, docType: string | null): Observable<UploadEvent> {
    const form = new FormData();
    form.append('file', file, file.name);
    if (docType) form.append('docType', docType);

    return this.http.post<AppDocument>(
      `${this.base}/applications/${applicationId}/documents`,
      form,
      { reportProgress: true, observe: 'events' as const },
    ).pipe(
      filter((e: HttpEvent<AppDocument>) =>
        e.type === HttpEventType.UploadProgress || e.type === HttpEventType.Response),
      map((e: HttpEvent<AppDocument>): UploadEvent | null => {
        if (e.type === HttpEventType.UploadProgress) {
          const total = e.total ?? 0;
          const loaded = e.loaded ?? 0;
          const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
          return { kind: 'progress', percent };
        }
        if (e.type === HttpEventType.Response && e.body) {
          return { kind: 'complete', document: e.body };
        }
        return null;
      }),
      filter((e): e is UploadEvent => e !== null),
      catchError(this.toError),
    );
  }

  /** DELETE a document. */
  delete(applicationId: number, documentId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/applications/${applicationId}/documents/${documentId}`)
      .pipe(catchError(this.toError));
  }

  download(doc: AppDocument): Observable<void> {
    const url = `${this.base}/applications/${doc.applicationId}/documents/${doc.documentId}/download`;
    return this.http.get(url, { responseType: 'blob' as const }).pipe(
      map(blob => {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = doc.fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }),
      catchError(this.toError),
    );
  }

  private toError(err: HttpErrorResponse) {
    const msg = (typeof err.error === 'string' && err.error)
      || err.error?.error
      || err.error?.message
      || `Request failed (HTTP ${err.status}).`;
    return throwError(() => new Error(msg));
  }
}
