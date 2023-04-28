import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, EMPTY, Subscription, switchMap, tap } from 'rxjs';
import { PlansService } from 'src/app/services/plans.service';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';
import { SharedService } from '../../../../../services/shared.service';
import { Plan } from '../../../../../models/plans.model';
import * as dayjs from 'dayjs';
import { PlanGridModal } from '../../../../../models/grid-modal';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.scss'],
})
export class PlanDetailComponent implements OnDestroy {
  displayedColumns = ['ID STAVKE PLANA', 'STANICE', 'VREME DOLASKA', 'VREME POLASKA', 'TRANZIT', 'KOLOSEK'];
  subscription: Subscription = new Subscription();
  activation = false;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PlanGridModal<Plan>,
    public sharedService: SharedService,
    public dialogRef: MatDialogRef<PlanDetailComponent>,
    private plansService: PlansService,
    private translateService: TranslateService,
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

  returnTime(dayTime: any) {
    let forDayCase = '';
    if (dayTime?.day === 0) return dayTime?.time;
    else if (dayTime?.day === 1) return forDayCase?.concat('(+', dayTime?.day, ') ', dayTime?.time);
  }

  activatePlan() {
    this.subscription.add(
      this.plansService.isForActivate(this.data.id).pipe(
        tap(() => this.activation = true),
        switchMap(() => this.plansService.activatePlan(this.data.id).pipe(
          catchError(error => {
            error.appCode
              ? this.translateService.showMessage(error.appCode)
              : this.translateService.showMessage(MESSAGE.error_activating_plan);
            return EMPTY;
          }),
        )),
      ).subscribe({
        next: () => {
          this.sharedService.openSnackBarWait(MESSAGE.activation_in_progress, 'Zatvori');
          this.closeModal();
        },
        error: error => {
          this.activation = false
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(MESSAGE.error_plan_is_for_activate)
              : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
          });
        },
      }),
    );
  }

  validatePlan() {
    this.subscription.add(
      this.plansService.validate(this.data.id).subscribe({
        next: (res) => {
          if (res.valid) {
            this.sharedService.openSnackBar(MESSAGE.success_valid_plan);
          } else {
            const arrLen = res.validationErrors.length;
            const err = res.validationErrors.splice(0, 5);
            const errorsLeft = arrLen - err.length;
            if (errorsLeft !== 0) {
              this.sharedService.openSnackBarValidation(
                err.join('\n') + `\n ...i još ${errorsLeft} validacionih grešaka...`,
                'Zatvori',
              );
            } else {
              this.sharedService.openSnackBarValidation(err.join('\n\n'), 'Zatvori');
            }
          }
        },
        error: errorMessage => {
          errorMessage.appCode
            ? this.translateService.showMessage(MESSAGE.plan_validate_error)
            : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
        },
      }),
    );
  }

  get isActivationEnabled(): boolean {
    const currentDateFormat = dayjs(new Date()).format('YYYY-MM-DD');
    const endDateFormat = dayjs(this.data.content.planInterval.endDate).format('YYYY-MM-DD');
    return this.data.activate && endDateFormat > currentDateFormat;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
