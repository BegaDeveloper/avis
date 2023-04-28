import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MESSAGE } from '../utils/messages';

@Injectable()
export class TranslateService {
  private _currentLang: string = 'sr-Latin';
  private _dictionary: any = {
    'sr-Latin': MESSAGE,
  };
  constructor(private snackBar: MatSnackBar) {}

  private translate(key: string): string {
    if (this._dictionary[this._currentLang] && this._dictionary[this._currentLang][key]) {
      return this._dictionary[this._currentLang][key];
    } else {
      return key;
    }
  }

  public instant(key: string) {
    return this.translate(key);
  }

  public showMessage(message: any) {
    return this.snackBar.open(this.translate(message), '', { panelClass: ['red-snackbar'] });
  }

  public showSuccessMessage(message: any) {
    return this.snackBar.open(this.translate(message), '', { panelClass: ['blue-snackbar'] });
  }
}
