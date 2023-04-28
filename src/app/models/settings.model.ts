import { MatButton } from '@angular/material/button';

export type ParamValue = string | number | boolean;

export interface AppParamValue {
  code: AppParamCode;
  booleanValue: boolean;
  numberValue: number;
  stringValue: string;
}

export interface AppParamCode {
  code: string;
  name: string;
  paramType: AppParamType;
}

export interface AppParamValueReset extends AppParamValue {
  reset: ParamValue;
}

export interface Params {
  [code: string]: AppParamValueReset;
}

export enum AppParamType {
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
}

export interface SaveParam {
  code: string;
  value: ParamValue;
  saveBtn?: MatButton;
  resetBtn?: MatButton;
}
