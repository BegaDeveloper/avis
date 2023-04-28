import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { Components } from '../utils/enums';
import { Version } from '../models/shared.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  timeOut: number = 10000;
  private _gridReload = new Subject<void>();

  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  get gridReload$(): Observable<void> {
    return this._gridReload.asObservable();
  }

  reloadGrid() {
    this._gridReload.next();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', { panelClass: ['blue-snackbar'] });
  }

  openSnackBarError(message: any) {
    this._snackBar.open(message, '', { panelClass: ['red-snackbar'] });
  }

  validationMessage(controlName: string, form: any, submit: boolean): boolean {
    let control = form.controls[controlName];
    return control && control.invalid && (control.touched || submit);
  }

  openSnackBarWait(message: any, action: any) {
    this._snackBar.open(message, action, { duration: 120000 });
  }

  //Get copyright value
  getCopyrightMarker(): Observable<Version> {
    return this.http.get<Version>('version');
  }

  //is for edit shared method
  isForEdit(id: number, components: Components): Observable<void> {
    let route = '';
    if (components === Components.INTERVAL_PLAN) {
      route = 'plan-intervals/is-for-edit';
    } else if (components === Components.ROUTES) {
      route = 'routes/is-for-edit';
    } else if (components === Components.PLANS) {
      route = 'plan/is-for-edit';
    } else if (components === Components.WEEKLY_SCHEDULE) {
      route = 'week-schedule/is-for-edit';
    }
    return this.http.get<void>(`${route}/${id}`);
  }

  //is for delete shared method
  isForDelete(id: number, components: Components): Observable<void> {
    let route = '';
    if (components === Components.STATION) {
      route = 'stations/is-for-delete';
    } else if (components === Components.TRAINS) {
      route = 'trains/is-for-delete';
    }
    return this.http.get<void>(`${route}/${id}`);
  }

  //Snack bar validation
  openSnackBarValidation(message: any, action: string) {
    this._snackBar.open(message, action, {
      duration: this.timeOut,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar-validate'],
    });
  }
}
