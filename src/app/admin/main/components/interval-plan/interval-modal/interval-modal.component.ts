import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IntervalPlanData } from 'src/app/models/interval-plan.model';
import { IntervalPlanService } from 'src/app/services/interval-plan.service';
import { SharedService } from 'src/app/services/shared.service';
import { MESSAGE } from 'src/app/utils/messages';
import * as dayjs from 'dayjs';
import { TranslateService } from '../../../../../services/translate.service';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { MyDateAdapter } from '../../plans/cut-plan/dateAdapter';
import { PlanInterval } from '../../../../../models/plans.model';
import { GridModal } from '../../../../../models/grid-modal';

@Component({
  selector: 'app-interval-modal',
  templateUrl: './interval-modal.component.html',
  styleUrls: ['./interval-modal.component.scss'],
  providers: [{ provide: DateAdapter, useClass: MyDateAdapter }],
})
export class IntervalModalComponent implements OnInit, OnDestroy {
  intervalForm: FormGroup = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
  });
  newInterval: IntervalPlanData = new IntervalPlanData('', '', '', '');
  isFormSubmitted = false;
  matcher = new MyErrorStateMatcher();
  subscription: Subscription = new Subscription();
  private _disabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
    private intervalService: IntervalPlanService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: GridModal<PlanInterval>,
    public dialogRef: MatDialogRef<IntervalModalComponent>,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.intervalForm.patchValue(this.data.content);
    }
  }

  set disabled(value: boolean) {
    this._disabled.next(value);
  }

  get disabled$(): Observable<boolean> {
    return this._disabled.asObservable();
  }

  onSubmit() {
    const startDateFormatted = dayjs(this.intervalForm.value.startDate).format('YYYY-MM-DD') + 'T00:00:00';
    const endDateFormatted = dayjs(this.intervalForm.value.endDate).format('YYYY-MM-DD') + 'T23:59:59.999';
    this.newInterval.startDate = startDateFormatted;
    this.newInterval.endDate = endDateFormatted;
    this.newInterval.name = this.intervalForm.value.name;
    this.newInterval.description = this.intervalForm.value.description;
    this.isFormSubmitted = true;
    if (!this.intervalForm.valid) {
      this.translateService.showMessage(MESSAGE.error_interval_plan_input);
      return;
    }
    if (this.data && this.intervalForm.valid) {
      this.disabled = true;
      this.subscription.add(
        this.intervalService.update(this.newInterval, this.data.id).subscribe({
          next: () => {
            this.sharedService.openSnackBar(MESSAGE.success_post);
            this.closeModal();
            this.sharedService.reloadGrid();
          },
          error: error => {
            this.disabled = false;
            error.appCode
              ? this.translateService.showMessage(error.error_interval_edit)
              : this.translateService.showMessage(MESSAGE.error_interval_edit);
          },
        }),
      );
    } else if (this.intervalForm.valid) {
      this.subscription.add(
        this.intervalService.post(this.newInterval).subscribe({
          next: () => {
            this.sharedService.openSnackBar(MESSAGE.success_post);
            this.closeModal();
            this.sharedService.reloadGrid();
          },
          error: error => {
            this.disabled = false;
            error.appCode
              ? this.translateService.showMessage(error.error_interval_save)
              : this.translateService.showMessage(MESSAGE.error_interval_save);
          },
        }),
      );
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
