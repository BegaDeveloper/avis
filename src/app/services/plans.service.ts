import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { CutInterval, Plan, PlanHeader } from '../models/plans.model';
import { SortDirection } from '@angular/material/sort';
import { IPage } from '../models/shared.model';
import { Components } from '../utils/enums';
import { SearchConnector } from './search.connector';
import { Job } from '../models/jobs.model';
import { Validation } from '../models/validation.model';
import { TranslateService } from './translate.service';
import { MESSAGE } from '../utils/messages';

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  constructor(
    private http: HttpClient,
    private connector: SearchConnector,
    private translateService: TranslateService,
  ) {}

  search(
    searchText: string,
    pageIndex: number,
    pageSize: number,
    active?: string,
    direction?: SortDirection
  ): Observable<IPage<PlanHeader>> {
    return this.connector.search<PlanHeader>(
      searchText,
      pageIndex,
      pageSize,
      active,
      direction,
      Components.PLANS,
    );
  }

  activatePlan(id: number): Observable<Job> {
    return this.http.post<Job>(`plan/activate/${id}`, null);
  }

  public uploadfile(file: File): Observable<Job> {
    let formParams = new FormData();
    formParams.append('plan', file);
    return this.http.post<Job>('plan/upload', formParams);
  }

//get by id
  getById(id: number): Observable<Plan> {
    return this.http.get<Plan>(`plan/${id}`);
  }

  //DUPLICATE PLAN
  duplicatePlan(id: number): Observable<Job> {
    return this.http.post<Job>(`plan/duplicate/${id}`, null);
  }

  //CUT PLAN
  cutPlan(id: number, data: string): Observable<Job> {
    const options = { headers: { 'Content-Type': 'application/json' } };

    return this.http.post<Job>(`plan/cut-plan/${id}`, JSON.stringify(data), options);
  }

  //PUT OR POST
  createOrUpdate(id: number, data: any): Observable<Plan> {
    return !!id ? this.http.put<Plan>(`plan/${id}`, data) : this.http.post<Plan>('plan', data);
  }

  //DELETE
  delete(id: number): Observable<Job> {
    return this.http.delete<Job>(`plan/${id}`);
  }

  //VALIDATE PLAN
  validate(id: number): Observable<Validation> {
    return this.http.get<Validation>(`plan/validate/${id}`);
  }

  //getting interval for cut plan
  getCutPlanInterval(id: number): Observable<CutInterval> {
    return this.http.get<CutInterval>(`plan/cut-interval/${id}`);
  }

  //check if plan is for cut
  isForCut(id: number): Observable<void> {
    return this.http.get<void>(`plan/is-for-cut/${id}`);
  }

  //check if plan is for activate
  isForActivate(id: number): Observable<void> {
    return this.http.get<void>(`plan/is-for-activate/${id}`).pipe(
      catchError(error => {
        error.errorMessages.forEach((err: any) => {
          err
            ? this.translateService.showMessage(MESSAGE.error_plan_is_for_activate)
            : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
        });
        throw new Error(error);
      }),
    );
  }
}
