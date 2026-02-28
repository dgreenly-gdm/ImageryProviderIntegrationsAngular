import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest, OrderResponse } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private http = inject(HttpClient);

  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>('/orders', order);
  }

  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>('/orders');
  }

  getOrder(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`/orders/${id}`);
  }
}
