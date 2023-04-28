import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WeeklyData, WeeklySchedule } from 'src/app/models/weekly.model';
import { SharedService } from 'src/app/services/shared.service';
import { WeeklySchedulesService } from 'src/app/services/weekly-schedules.service';
import { MESSAGE } from 'src/app/utils/messages';
import { TranslateService } from '../../../../../services/translate.service';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SpecialDayEnum } from '../../../../../utils/enums';
import { GridModal } from '../../../../../models/grid-modal';

@Component({
  selector: 'app-add-weekly-schedule',
  templateUrl: './add-weekly-schedule.component.html',
  styleUrls: ['./add-weekly-schedule.component.scss'],
})
export class AddWeeklyScheduleComponent implements OnInit, OnDestroy {
  reportForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    monday: [false],
    tuesday: [false],
    wednesday: [false],
    thursday: [false],
    friday: [false],
    saturday: [false],
    sunday: [false],
    specialDayIndicator: ['', Validators.required],
  });
  newReport: WeeklyData = new WeeklyData('', false, false, false, false, false, false, false, SpecialDayEnum.NONE);
  matcher = new MyErrorStateMatcher();
  isFormSubmitted: boolean = false;
  subscription: Subscription = new Subscription();
  specialDaysArray: any[] = [];
  private _disabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<AddWeeklyScheduleComponent>,
    public sharedService: SharedService,
    private fb: FormBuilder,
    private weeklyService: WeeklySchedulesService,
    private translateService: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: GridModal<WeeklySchedule>,
  ) {}

  ngOnInit(): void {
    this.specialDaysArray = Object.keys(SpecialDayEnum).map(key => {
      return {
        key,
        value: SpecialDayEnum[key as keyof typeof SpecialDayEnum],
      };
    });
    if (this.data) {
      this.reportForm.patchValue(this.data.content);
    }
  }

  set disabled(value: boolean) {
    this._disabled.next(value);
  }

  get disabled$(): Observable<boolean> {
    return this._disabled.asObservable();
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.newReport = this.reportForm.value;
    this.isFormSubmitted = true;
    if (!this.reportForm.valid) {
      this.translateService.showMessage(MESSAGE.error_weekly_schedule_input);
      return;
    }
    if (this.data.content && this.reportForm.valid) {
      this.disabled = true;
      this.subscription.add(
        this.weeklyService.update(this.newReport, this.data.id).subscribe({
          next: () => {
            this.sharedService.openSnackBar(MESSAGE.success_put);
            this.closeModal();
            this.sharedService.reloadGrid();
          },
          error: error => {
            this.disabled = false;
            error.appCode
              ? this.translateService.showMessage(error.appCode)
              : this.translateService.showMessage(MESSAGE.error_weekly_schedule_edit);
          },
        }),
      );
    } else if (this.reportForm.valid) {
      this.subscription.add(
        this.weeklyService.post(this.newReport).subscribe({
          next: () => {
            this.sharedService.openSnackBar(MESSAGE.success_post);
            this.closeModal();
            this.sharedService.reloadGrid();
          },
          error: error => {
            this.disabled = false;
            error.appCode
              ? this.translateService.showMessage(error.appCode)
              : this.translateService.showMessage(MESSAGE.error_weekly_schedule_save);
          },
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
