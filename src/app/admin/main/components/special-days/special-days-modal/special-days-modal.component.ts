import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MESSAGE } from '../../../../../utils/messages';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../../../services/shared.service';
import { TranslateService } from '../../../../../services/translate.service';
import { SpecialDayService } from '../../../../../services/special-day.service';
import { NewSpecialDayData, SpecialDays } from '../../../../../models/special-days.model';
import { VALIDATOR_PATTERNS } from '../../../../../utils/validator-patterns';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GridModal } from '../../../../../models/grid-modal';

@Component({
  selector: 'app-special-days-modal',
  templateUrl: './special-days-modal.component.html',
  styleUrls: ['./special-days-modal.component.scss'],
})
export class SpecialDaysModalComponent implements OnInit, OnDestroy {
  specialDayForm: FormGroup = this.fb.group({
    day: ['', Validators.required],
    month: ['', Validators.required],
    startYear: ['', Validators.required],
    endYear: ['', Validators.required],
    name: ['', Validators.required],
  });
  newSpecialDay: NewSpecialDayData = new NewSpecialDayData(0, 0, 0, 0, 0, '');
  allYears: any = false;
  onlyIntegerWithEndDotPattern = VALIDATOR_PATTERNS.ONLY_INTEGER_VALUES_DOT_ALLOWED;
  matcher = new MyErrorStateMatcher();
  isFormSubmitted: boolean = false;
  subscription: Subscription = new Subscription();
  private _disabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<SpecialDaysModalComponent>,
    public sharedService: SharedService,
    private fb: FormBuilder,
    private specialDayService: SpecialDayService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: GridModal<SpecialDays>,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      if (this.data.content.startYear === 0 && this.data.content.endYear === 9999) {
        this.allYears = true;
        this.specialDayForm.get('startYear')?.disable();
        this.specialDayForm.get('endYear')?.disable();
        this.specialDayForm.get('startYear')?.patchValue(0);
        this.specialDayForm.get('endYear')?.patchValue(9999);
      }

      this.specialDayForm.get('id')?.patchValue(this.data.content.id);
      this.specialDayForm.get('day')?.patchValue(this.data.content.day);
      this.specialDayForm.get('month')?.patchValue(this.data.content.month);
      this.specialDayForm.get('startYear')?.patchValue(this.data.content.startYear);
      this.specialDayForm.get('endYear')?.patchValue(this.data.content.endYear);
      this.specialDayForm.get('name')?.patchValue(this.data.content.name);
    }
  }

  set disabled(value: boolean) {
    this._disabled.next(value);
  }

  get disabled$(): Observable<boolean> {
    return this._disabled.asObservable();
  }

  onChecked(event: MatCheckboxChange) {
    if (event.checked) {
      this.allYears = !this.allYears;
      this.specialDayForm.get('startYear')?.disable();
      this.specialDayForm.get('endYear')?.disable();
      this.specialDayForm.get('startYear')?.patchValue(0);
      this.specialDayForm.get('endYear')?.patchValue(9999);
    } else {
      this.allYears = !this.allYears;
      this.specialDayForm.get('startYear')?.enable();
      this.specialDayForm.get('endYear')?.enable();
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.specialDayForm.value.day = Number(this.specialDayForm.value.day);
    this.specialDayForm.value.month = Number(this.specialDayForm.value.month);
    this.specialDayForm.value.startYear = Number(this.specialDayForm.value.startYear);
    this.specialDayForm.value.endYear = Number(this.specialDayForm.value.endYear);
    this.isFormSubmitted = true;
    if (
      this.specialDayForm.value.day > 31 ||
      this.specialDayForm.value.month > 12 ||
      this.specialDayForm.value.startYear < 0 ||
      this.specialDayForm.value.endYear > 9999 ||
      this.specialDayForm.value.startYear > this.specialDayForm.value.endYear
    ) {
      this.translateService.showMessage(MESSAGE.error_special_day_input);
      return;
    }

    this.newSpecialDay = this.specialDayForm.value;
    if (this.specialDayForm.get('startYear')?.disabled && this.specialDayForm.get('endYear')?.disabled) {
      this.newSpecialDay.startYear = 0;
      this.newSpecialDay.endYear = 9999;
    }
    if (!this.specialDayForm.valid) {
      this.translateService.showMessage(MESSAGE.error_special_day_input);
      return;
    }
    if (this.data.content && this.specialDayForm.valid) {
      this.disabled = true;
      this.subscription.add(
        this.specialDayService.update(this.newSpecialDay, this.data.content.id).subscribe({
          next: () => {
            this.sharedService.openSnackBar(MESSAGE.success_put);
            this.closeModal();
            this.sharedService.reloadGrid();
          },
          error: error => {
            this.disabled = false;
            error.appCode
              ? this.translateService.showMessage(error.appCode)
              : this.translateService.showMessage(MESSAGE.error_special_day_update);
          },
        }),
      );
    } else if (this.specialDayForm.valid) {
      this.subscription.add(
        this.specialDayService.post(this.newSpecialDay).subscribe({
          next: () => {
            this.sharedService.openSnackBar(MESSAGE.success_post);
            this.closeModal();
            this.sharedService.reloadGrid();
          },
          error: error => {
            this.disabled = false;
            error.appCode
              ? this.translateService.showMessage(error.appCode)
              : this.translateService.showMessage(MESSAGE.error_special_day_save);
          },
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
