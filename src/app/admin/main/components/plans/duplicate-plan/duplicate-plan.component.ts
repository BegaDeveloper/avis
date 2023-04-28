import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PlansService } from 'src/app/services/plans.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';
import { PlanHeader } from '../../../../../models/plans.model';

@Component({
  selector: 'app-duplicate-plan',
  templateUrl: './duplicate-plan.component.html',
  styleUrls: ['./duplicate-plan.component.scss'],
})
export class DuplicatePlanComponent implements OnDestroy {
  subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private plansService: PlansService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: {status: boolean, data: PlanHeader},
    public dialogRef: MatDialogRef<DuplicatePlanComponent>,
    private translateService: TranslateService,
  ) {}

  duplicate() {
    this.subscription.add(
      this.plansService.duplicatePlan(this.data.data.id).subscribe({
        next: () => {
          this.sharedService.reloadGrid();
          this.closeModal();
        },
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(err)
              : this.translateService.showMessage(MESSAGE.error_duplicate_plan);
          });
        },
      }),
    );
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
