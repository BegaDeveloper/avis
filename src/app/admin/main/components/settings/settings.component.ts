import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { catchError, concatMap, map, Observable, of, Subscription, tap } from 'rxjs';
import {
  AppParamType,
  AppParamValue,
  AppParamValueReset,
  Params,
  ParamValue,
  SaveParam,
} from '../../../../models/settings.model';
import { SettingsService } from '../../../../services/settings.service';
import { MESSAGE } from '../../../../utils/messages';
import { TranslateService } from '../../../../services/translate.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  params: Params = {};
  paramType = AppParamType;
  private saveParam: EventEmitter<SaveParam> = new EventEmitter<SaveParam>();
  private subscription: Subscription = new Subscription();
  params$: Observable<AppParamValue[]> = this.settingsService.get().pipe(
    tap(params =>
      params.map(param => {
        this.params[param.code.code] = { ...param, reset: this.getParamValue(param) };
      }),
    ),
  );
  saveParam$: Observable<SaveParam> = this.saveParam.asObservable().pipe(
    concatMap(event =>
      this.settingsService.update(event.code, event.value).pipe(
        tap(() => {
          this.params[event.code].reset = event.value;
          if (event.saveBtn && event.resetBtn) {
            event.saveBtn.disabled = true;
            event.resetBtn.disabled = true;
          }
          this.translateService.showSuccessMessage(MESSAGE.success_update_app_param);
        }),
        map(() => event),
        catchError(err => {
          this.resetParam(event);
          this.translateService.showMessage(err.errorMessages[0] || MESSAGE.error_save_app_param);
          return of(event);
        }),
      ),
    ),
  );

  constructor(private settingsService: SettingsService, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.subscription.add(this.saveParam$.subscribe());
  }

  onInputValueChange(param: AppParamValueReset, resetBtn: MatButton, saveBtn: MatButton) {
    if (this.getParamValue(param) !== param.reset) {
      resetBtn.disabled = false;
      saveBtn.disabled = false;
    } else {
      resetBtn.disabled = true;
      saveBtn.disabled = true;
    }
  }

  reset(param: AppParamValueReset, resetBtn: MatButton, saveBtn: MatButton): void {
    this.resetParamValue(param);
    resetBtn.disabled = true;
    saveBtn.disabled = true;
  }

  save(param: AppParamValueReset, resetBtn?: MatButton, saveBtn?: MatButton): void {
    if (!this.validate(param)) {
      this.translateService.showMessage(MESSAGE.error_not_valid_app_param);
      return;
    }
    const paramValue = this.getParamValue(param);
    if (paramValue !== param.reset) {
      this.saveParam.emit({
        code: param.code.code,
        value: paramValue,
        saveBtn,
        resetBtn,
      });
    }
  }

  private getParamValue(param: AppParamValue): ParamValue {
    let value: ParamValue;
    switch (param.code.paramType) {
      case AppParamType.BOOLEAN:
        value = param.booleanValue;
        break;
      case AppParamType.NUMBER:
        value = Number(param.numberValue);
        break;
      case AppParamType.STRING:
        value = param.stringValue;
    }
    return value;
  }

  private resetParam(event: SaveParam): void {
    const param = this.params[event.code];
    this.resetParamValue(param);
  }

  private resetParamValue(param: AppParamValueReset): void {
    switch (param.code.paramType) {
      case AppParamType.BOOLEAN:
        param.booleanValue = param.reset as boolean;
        break;
      case AppParamType.NUMBER:
        param.numberValue = param.reset as number;
        break;
      case AppParamType.STRING:
        param.stringValue = param.reset as string;
    }
  }

  private validate(param: AppParamValueReset): boolean {
    let valid = true;
    if (AppParamType.NUMBER === param.code.paramType) {
      valid = !Number.isNaN(Number(param.numberValue));
    }
    return valid;
  }

  onCompare(_left: KeyValue<string, AppParamValueReset>, _right: KeyValue<string, AppParamValueReset>): number {
    return 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
