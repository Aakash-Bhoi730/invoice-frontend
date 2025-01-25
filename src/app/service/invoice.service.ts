import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/invoice';

  constructor(private http: HttpClient) {}

  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, invoiceData);
  }
  getInvoices(
    sort: 'ASC' | 'DESC' = 'ASC',
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('sort', sort)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }
  searchInvoices(
    search: string,
    sort: 'ASC' | 'DESC' = 'ASC',
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('search', search)
      .set('sort', sort)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }
  getInvoiceDetails(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
