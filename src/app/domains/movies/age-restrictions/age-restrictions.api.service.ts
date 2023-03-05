import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AgeRestriction } from './age-restrictions.interface';

@Injectable({
  providedIn: 'root',
})
export class AgeRestrictionApiService {
  private http = inject(HttpClient);

  getAgeRestrictions$() {
    return this.http.get<AgeRestriction[]>('ageRestrictions');
  }
}
