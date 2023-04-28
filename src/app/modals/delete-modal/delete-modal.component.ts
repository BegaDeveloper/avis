import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IntervalPlanService } from 'src/app/services/interval-plan.service';
import { RoutesService } from 'src/app/services/routes.service';
import { SharedService } from 'src/app/services/shared.service';
import { StationService } from 'src/app/services/station.service';
import { TrainService } from 'src/app/services/train.service';
import { WeeklySchedulesService } from 'src/app/services/weekly-schedules.service';
import { Components } from 'src/app/utils/enums';
import { MESSAGE } from 'src/app/utils/messages';
import { SpecialDayService } from '../../services/special-day.service';
import { TranslateService } from '../../services/translate.service';
import { PlansService } from '../../services/plans.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  component: string;
  id: number;

  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private stationService: StationService,
    private trainService: TrainService,
    private intervalService: IntervalPlanService,
    private sharedService: SharedService,
    private translateService: TranslateService,
    private weekly: WeeklySchedulesService,
    private routeService: RoutesService,
    private specialDaysService: SpecialDayService,
    private plansService: PlansService,
  ) {
    this.id = data.data.id;
    this.component = data.component;
  }

  ngOnInit(): void {}

  deleteRow() {
    if (this.component == Components.STATION) {
      this.stationService.delete(this.id).subscribe({
        next: () => {
          this.sharedService.reloadGrid();
          this.dialogRef.close();
          this.sharedService.openSnackBar(MESSAGE.success_delete);
        },
        error: error => {
          error.appCode
            ? this.translateService.showMessage(error.appCode)
            : this.translateService.showMessage(MESSAGE.error_station_delete);
        },
      });
    } else if (this.component == Components.TRAINS) {
      this.trainService.delete(this.id).subscribe({
        next: () => {
          this.sharedService.reloadGrid();
          this.dialogRef.close();
          this.sharedService.openSnackBar(MESSAGE.success_delete);
        },
        error: error => {
          error.appCode
            ? this.translateService.showMessage(error.appCode)
            : this.translateService.showMessage(MESSAGE.error_train_delete);
        },
      });
    } else if (this.component == Components.INTERVAL_PLAN) {
      this.intervalService.delete(this.id).subscribe({
        next: () => {
          this.sharedService.reloadGrid();
          this.dialogRef.close();
          this.sharedService.openSnackBar(MESSAGE.success_delete);
        },
        error: (error: any) => {
          error.appCode
            ? this.translateService.showMessage(error.appCode)
            : this.sharedService.openSnackBar(error.error_interval_delete);
        },
      });
    } else if (this.component == Components.WEEKLY_SCHEDULE) {
      this.weekly.delete(this.id).subscribe({
        next: () => {
          this.sharedService.reloadGrid();
          this.dialogRef.close();
          this.sharedService.openSnackBar(MESSAGE.success_delete);
        },
        error: (error: any) => {
          error.appCode
            ? this.translateService.showMessage(error.appCode)
            : this.translateService.showMessage(MESSAGE.error_weekly_schedule_delete);
        },
      });
    } else if (this.component == Components.ROUTES) {
      this.routeService.delete(this.id).subscribe({
        next: () => {
          this.sharedService.reloadGrid();
          this.dialogRef.close();
          this.sharedService.openSnackBar(MESSAGE.success_delete);
        },
        error: (error: any) => {
          error.appCode
            ? this.translateService.showMessage(error.appCode)
            : this.translateService.showMessage(MESSAGE.error_weekly_schedule_delete);
        },
      });
    } else if (this.component == Components.SPECIAL_DAY) {
      this.specialDaysService.delete(this.id).subscribe({
        next: () => {
          this.sharedService.reloadGrid();
          this.dialogRef.close();
          this.sharedService.openSnackBar(MESSAGE.success_delete);
        },
        error: (error: any) => {
          error.appCode
            ? this.translateService.showMessage(error.appCode)
            : this.sharedService.openSnackBar(error.error_special_day_delete);
        },
      });
    } else if (this.component == Components.PLANS) {
      this.plansService.delete(this.id).subscribe({
        next: () => {
          this.sharedService.reloadGrid();
          this.dialogRef.close();
        },
        error: (error: any) => {
          error.appCode
            ? this.translateService.showMessage(error.appCode)
            : this.sharedService.openSnackBar(error.error_plan_delete);
        },
      });
    }
  }
}
