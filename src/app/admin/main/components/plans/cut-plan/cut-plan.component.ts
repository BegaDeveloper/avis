import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { Subscription } from 'rxjs';
import { PlansService } from 'src/app/services/plans.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';
import { MyDateAdapter } from './dateAdapter';
import { CutInterval, PlanHeader } from '../../../../../models/plans.model';

@Component({
  selector: 'app-cut-plan',
  templateUrl: './cut-plan.component.html',
  styleUrls: ['./cut-plan.component.scss'],
  providers: [{ provide: DateAdapter, useClass: MyDateAdapter }],
})
export class CutPlanComponent implements OnInit, OnDestroy {
  cutForm: FormGroup;
  subscription: Subscription = new Subscription();
  minDate: Date;
  maxDate: Date;

  constructor(
    private sharedService: SharedService,
    private plansService: PlansService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: {data: PlanHeader, dataInterval: CutInterval},
    public dialogRef: MatDialogRef<CutPlanComponent>,
    private translateService: TranslateService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.maxDate = this.data.dataInterval.maxDate;
    this.minDate = this.data.dataInterval.minDate;
    this.cutForm = this.fb.group({
      date: [this.minDate, Validators.required],
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  getErrorMessage(pickerInput: string): string {
    if (!pickerInput || pickerInput === '') {
      return 'Izaberite datum.';
    }
    return this.isMyDateFormat(pickerInput);
  }

  isMyDateFormat(date: string): string {
    if (date.length !== 10) {
      return 'Nevalidan unos: Unesite datum u formatu DD.MM.YYYY ';
    } else {
      const da = date.split('.');
      const endDate = dayjs(this.data.data.planInterval.endDate).format('DD.MM.YYYY');
      const startDate = dayjs(this.data.data.planInterval.startDate).format('DD.MM.YYYY');

      if (date > endDate || date < startDate) {
        return `Nevalidan datum: Odaberite datum izmedu ${startDate} i ${endDate}`;
      } else if (!dayjs(date).isValid()) {
        return 'Nevalidan unos: Unesite datum u formatu DD.MM.YYYY';
      } else if (da.length !== 3 || da[0].length !== 4 || da[1].length !== 2 || da[2].length !== 2) {
        return 'Nevalidan unos: Unesite datum u formatu DD.MM.YYYY';
      }
    }
    return 'Nepoznata greška.';
  }

  cut() {
    const date = this.cutForm.get('date')?.value;
    const dateFormatted = dayjs(date).format('YYYY-MM-DD');
    if (this.cutForm.valid) {
      this.subscription.add(
        this.plansService.cutPlan(this.data.data.id, dateFormatted).subscribe({
          next: () => {
            this.sharedService.openSnackBarWait(MESSAGE.cut_plan_in_progress, 'Zatvori');
            this.dialogRef.close();
          },
          error: error => {
            error.errorMessages.forEach((err: any) => {
              err ? this.translateService.showMessage(err) : this.translateService.showMessage(MESSAGE.error_cut_plan);
            });
          },
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
