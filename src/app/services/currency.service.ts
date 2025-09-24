import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface CurrencyMap {
  [key: string]: {
    code?: string; // may be numeric in some APIs
    decimal_digits?: number;
    name: string;
    name_plural?: string;
    rounding?: number;
    symbol?: string;
    symbol_native?: string;
    type?: string;
    short_code?: string; // potential alpha code field
    iso_code?: string;   // potential alpha code field
    alphabetic_code?: string; // potential alpha code field
  };
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly baseUrl = 'https://api.currencybeacon.com/v1';

  constructor(private readonly http: HttpClient) {}

  // Retreievs api key from environment file
  private getApiKey(): string {
    return environment.CURRENCYBEACON_API_KEY ?? '';
  }

  // Formats currency code ie GBP, USD
  private toAlphaCode(entryKey: string, c: CurrencyMap[string]): string | null {
    if (typeof entryKey === 'string' && entryKey.trim() && !/^\d+$/.test(entryKey.trim())) {
      return entryKey.trim().toUpperCase();
    }

    const candidates = [
      c.code,
      c.short_code as string | undefined,
      c.iso_code as string | undefined,
      c.alphabetic_code as string | undefined
    ];

    for (const cand of candidates) {
      if (typeof cand === 'string' && cand.trim() && !/^\d+$/.test(cand.trim())) {
        return cand.trim().toUpperCase();
      }
    }
    return null;
  }

  // Calls api to retrive currency list
  getCurrencies(): Observable<CurrencyOption[]> {
    const params = new HttpParams().set('api_key', this.getApiKey());

    return this.http
      .get<{ response: CurrencyMap }>(`${this.baseUrl}/currencies`, { params })
      .pipe(
        map((res) => {
          const list: CurrencyOption[] = [];
          for (const [key, c] of Object.entries(res.response)) {
            // optional type filter if present
            if (c.type && !(c.type === 'fiat' || c.type === 'crypto')) continue;
            const alpha = this.toAlphaCode(key, c);
            if (!alpha) continue;
            list.push({ code: alpha, name: c.name, symbol: c.symbol });
          }
          return list.sort((a, b) => a.code.localeCompare(b.code));
        })
      );
  }

  // Converts amount requested for currencies selected 
  convertCurrency(from: string, to: string, amount: number): Observable<number> {
    const params = new HttpParams()
      .set('api_key', this.getApiKey())
      .set('from', from)
      .set('to', to)
      .set('amount', String(amount));

    return this.http
      .get<{ response: { value: number } }>(`${this.baseUrl}/convert`, { params })
      .pipe(map((res) => res.response.value));
  }
}
