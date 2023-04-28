import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { Plan, PlanInterval, PlanItem, PostPlan, PostPlanData } from 'src/app/models/plans.model';
import { WeeklySchedule } from 'src/app/models/weekly.model';
import { IntervalPlanService } from 'src/app/services/interval-plan.service';
import { PlansService } from 'src/app/services/plans.service';
import { RoutesService } from 'src/app/services/routes.service';
import { SharedService } from 'src/app/services/shared.service';
import { TrainService } from 'src/app/services/train.service';
import { TranslateService } from 'src/app/services/translate.service';
import { WeeklySchedulesService } from 'src/app/services/weekly-schedules.service';
import { MESSAGE } from 'src/app/utils/messages';
import { Route } from '../../../../../models/routes.model';
import { Train } from '../../../../../models/trains.modal';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss'],
})
export class AddPlanComponent implements OnInit, OnDestroy {
  weekly$: Observable<WeeklySchedule[]> = this.weeklyService.get()
    .pipe(
      tap((res: WeeklySchedule[]) => {
        if (this.data?.id) {
          const id = this.data.plansData.weekSchedule?.id;
          res.filter((c: WeeklySchedule) => c.id === id)?.map((el: WeeklySchedule) =>
            this.addPlanForm.get('weekScheduleId')?.setValue(el.id)
          );
        }
      })
    );
  intervalPlan$: Observable<PlanInterval[]> = this.intervalService.get()
    .pipe(
      tap((res: PlanInterval[]) => {
        if (this.data?.id) {
          const id = this.data.plansData.planInterval.id;
          res.filter((item: PlanInterval) => item.id === id)?.map((el: PlanInterval) =>
            this.addPlanForm.get('planIntervalId')?.setValue(el.id)
          );
        }
      })
    );
  trains$: Observable<Train[]> = this.trainService.get()
    .pipe(
      tap((res: Train[]) => {
        if (this.data?.id) {
          const id = this.data.plansData.train.id;
          res.filter((c: Train) => c.id == id)?.map((el: Train) =>
            this.addPlanForm.get('trainId')?.setValue(el.id)
          );
        }
      })
    );
  routes$: Observable<Route[]> = this.routeService.get()
    .pipe(
      tap((res: Route[]) => {
        if (this.data?.id) {
          const id = this.data.plansData.route.id;
          res.filter((c: Route) => c.id == id)?.map((el: Route) =>
            this.addPlanForm.get('routeId')?.setValue(el.id)
          );
        }
      }),
    );

  addPlanForm: FormGroup = this.fb.group({
    planIntervalId: ['', Validators.required],
    weekScheduleId: [''],
    routeId: ['', Validators.required],
    trainId: ['', Validators.required],
    planItems: this.fb.array([]),
  });
  matcher = new MyErrorStateMatcher();
  private subscription = new Subscription();
  displayedColumns = ['STANICE', 'VREME_DOLASKA', 'VREME_ODLASKA', 'TRANZIT', 'KOLOSEK'];
  lastInArray: any;
  _routeItems = new BehaviorSubject([]);
  plansArray: PlanItem[];
  weekScheduleName: string;
  routeName: string;
  intervalPlanName: string;
  isFormSubmitted: boolean = false;
  private disabledVariable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get disabledVariable$(): Observable<boolean> {
    return this.disabledVariable.asObservable();
  }

  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
    private intervalService: IntervalPlanService,
    public dialogRef: MatDialogRef<AddPlanComponent>,
    private translateService: TranslateService,
    private weeklyService: WeeklySchedulesService,
    private trainService: TrainService,
    private routeService: RoutesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private planService: PlansService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { id: number; plansData: Plan },
  ) {}

  ngOnInit(): void {
    if (this.data?.plansData) {
      this.plansArray = this.data.plansData.planItems;
      this.weekScheduleName = this.data.plansData.weekSchedule?.name;
      this.intervalPlanName = this.data.plansData.planInterval.name;
      this.routeName = this.data.plansData.route.name.concat(` (${this.data.plansData.route.id})`);
    }

    if (this.data?.plansData) {
      this.reset();
      this.plansArray.forEach(plan =>
        this.planItems.push(this.generateFormGroup(plan))
      );
      this._routeItems.next(this.planItems.value);
      this.lastInArray = this.planItems.value.at(-1);
    }

    this.subscription.add(
      this.disabledVariable$.subscribe(disabled =>
        disabled ? this.addPlanForm.disable() : this.addPlanForm.enable()
      )
    );
  }

  setDisabled(value: boolean) {
    this.disabledVariable.next(value);
  }

  getDisabled() {
    return this.disabledVariable.getValue();
  }

  changeRouteTooltip(event: MatSelectChange) {
    this.routeName = event.source.triggerValue;
  }

  changeWeeklyTooltip(event: MatSelectChange) {
    this.weekScheduleName = event.source.triggerValue;
  }

  changeIntervalTooltip(event: MatSelectChange) {
    this.intervalPlanName = event.source.triggerValue;
  }

  private generateFormGroup(val: any) {
    return this.fb.group({
      stationName: this.fb.control(val.routeItem.station.name),
      stationId: this.fb.control(val.routeItem.station.id),
      timeArrival: this.fb.group({
        day: this.fb.control(val?.timeArrival?.day == null ? 0 : val?.timeArrival?.day),
        time: this.fb.control(val?.timeArrival?.time),
      }),
      timeDeparture: this.fb.group({
        day: this.fb.control(val?.timeDeparture?.day == null ? 0 : val?.timeDeparture?.day),
        time: this.fb.control(val?.timeDeparture?.time),
      }),
      transit: this.fb.control(val.transit),
      track: this.fb.control(val.track),
    });
  }

  negativeValuesRestrict(e: any) {
    if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
      return false;
    }

    if (e?.target.value.length == 0 && e.key == 0) {
      e.preventDefault();
    }
    return true;
  }

  oneAndZeroValueOnly(e: any) {
    return e.keyCode === 49 || e.keyCode === 48 || e.keyCode === 8;
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (!this.addPlanForm.valid) {
      this.translateService.showMessage(MESSAGE.error_plan_input);
      return;
    }
    if (this.addPlanForm.valid) {
      this.setDisabled(true);

      const newPlan = new PostPlan(0, 0, 0, 0, []);
      const formValues = this.addPlanForm.value;

      for (const key of Object.keys(newPlan)) {
        if (key in formValues) {
          newPlan[key as keyof PostPlanData] = formValues[key];
        }
      }

      newPlan.planItems.forEach((el: PlanItem & { stationName?: string }) =>
        delete el.stationName
      );

      this.planService.createOrUpdate(this.data?.id!, newPlan).subscribe({
        next: () => {
          this.closeModal();
          this.sharedService.reloadGrid();
          this.sharedService.openSnackBar(MESSAGE.success_put_plan);
        },
        error: error => {
          this.setDisabled(false);
          error.appCode
            ? this.translateService.showMessage(error.appCode)
            : this.translateService.showMessage(MESSAGE.error_plan_put);
        },
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  get planItems(): FormArray {
    return this.addPlanForm.get('planItems') as FormArray;
  }

  createObjForm(event: any) {
    return this.fb.group({
      stationName: [event.station.name],
      stationId: [event.station.id],
      timeArrival: this.fb.group({
        day: [0],
        time: [''],
      }),
      timeDeparture: this.fb.group({
        day: [0],
        time: [''],
      }),
      transit: [false],
      track: [''],
    });
  }

  routeClick(event: Route) {
    this.reset();
    event.routeItems.forEach(item =>
      this.planItems.push(this.createObjForm(item))
    );
    this._routeItems.next(this.planItems.value);
    this.lastInArray = this.planItems.value.at(-1);
  }

  reset() {
    this.planItems.clear();
  }

  onClone(i: number) {
    const transitValue = this.planItems.at(i);
    if (transitValue && transitValue.get('transit')?.value) {
      transitValue.get('timeDeparture')?.setValue(transitValue.get('timeArrival')?.value);
    }
  }

  secondClone(i: number) {
    console.log(i);
  }

  firstHidden(i?: number): boolean {
    return i === 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
