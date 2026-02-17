import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StocksService {

  private getUrl  = 'https://localhost:7008/api/trading/stocks/ohlc';
  private loadUrl = 'https://localhost:7008/api/trading/sync/load-ohlc';
  private filterUrl = 'https://localhost:7008/api/trading/ohlc/filter';

  constructor(private http: HttpClient) {}

  loadOhlc(): Observable<string> {
  return this.http.post(this.loadUrl, {}, {
    responseType: 'text'
  });
}


  /** 2️⃣ Read OHLC data from DB */
  getStocks(): Observable<any[]> {
    return this.http.get<any[]>(this.getUrl);
  }

  getFilteredStocks(filter: any) {
  return this.http.get<any>(this.filterUrl, {
    params: {
      symbol: filter.symbol || '',
      fromDate: filter.fromDate
  ? filter.fromDate.toLocaleDateString('en-CA')
  : '',
toDate: filter.toDate
  ? filter.toDate.toLocaleDateString('en-CA')
  : '',

      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize
    }
  });
}


}
