import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogSearchRequest, CatalogSearchResponse } from '../models/stac.model';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private http = inject(HttpClient);

  searchCatalog(params: CatalogSearchRequest): Observable<CatalogSearchResponse> {
    return this.http.post<CatalogSearchResponse>('/catalog/search', params);
  }

  getCollections(): Observable<string[]> {
    return this.http.get<string[]>('/catalog/collections');
  }
}
