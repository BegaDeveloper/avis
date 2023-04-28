import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, EMPTY, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import * as dayjs from 'dayjs';
import { PlansService } from 'src/app/services/plans.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';
import { AddPlanComponent } from './add-plan/add-plan.component';
import { PlanDetailComponent } from './plan-detail/plan-detail.component';
import { CutInterval, Plan, PlanHeader } from '../../../../models/plans.model';
import { DuplicatePlanComponent } from './duplicate-plan/duplicate-plan.component';
import { CutPlanComponent } from './cut-plan/cut-plan.component';
import { DeleteModalComponent } from '../../../../modals/delete-modal/delete-modal.component';
import { Components } from 'src/app/utils/enums';
import { SearchComponent } from '../reusable-component/search/search.component';
import { PlanGridModal } from '../../../../models/grid-modal';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchComponent) search: SearchComponent;

  total = 0;
  data: PlanHeader[];
  isLoadingResults = true;

  displayedColumns: string[] = [
    'ID_PLAN',
    'NAME_INT_PLAN',
    'NAME_WEEK',
    'ROUTE',
    'TRAIN_ID',
    'DATE',
    'ACTIVE',
    'AKCIJA',
  ];
  private subscription: Subscription = new Subscription();

  id: number;
  modal: boolean;
  status: boolean;
  file: File;

  constructor(
    private sharedService: SharedService,
    private service: PlansService,
    private dialog: MatDialog,
    private translateService: TranslateService,

  ) {}

  ngAfterViewInit(): void {
    this.subscription.add(
      merge(
        this.sort.sortChange,
        this.paginator.page,
        this.search.searchBox,
        this.sharedService.gridReload$
      ).pipe(
        startWith({}),
        switchMap((events) => {
          this.isLoadingResults = true;
          if (typeof events === 'object' && events.hasOwnProperty('searchText')) {
            this.paginator.pageIndex = 0
          }
          return this.service.search(
            this.search.searchText,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          if (data === null) {
            return [];
          }
          this.total = data.totalElements;
          return data.content;
        }),
      ).subscribe(data => this.data = data)
    );
  }

  onFilechange(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.service.uploadfile(this.file).subscribe(() => {
        this.sharedService.openSnackBarWait(MESSAGE.upload_in_progress, 'Zatvori');
      });
    }
  }

  openModal(modalData: PlanGridModal<Plan>) {
    this.dialog.open(PlanDetailComponent, {
      width: '1024px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  openDuplicateModal(element: PlanHeader) {
    this.dialog.open(DuplicatePlanComponent, {
      width: '500px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: {
        status: this.status,
        data: element,
      },
      autoFocus: false,
    });
  }

  openDetail(id: number) {
    this.service.getById(id).subscribe({
      next: res => this.openModal({id, content: res, activate: false}),
      error: error => {
        error.errorMessages.forEach((err: any) => {
          err
            ? this.translateService.showMessage(err)
            : this.translateService.showMessage(MESSAGE.error_plan_details_load);
        });
      },
    });
  }

  openActivate(id: number) {
    this.service.isForActivate(id).pipe(
      switchMap(() => this.service.getById(id).pipe(
        catchError( error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(err)
              : this.translateService.showMessage(MESSAGE.error_plan_details_load);
          });
          return EMPTY;
        })
      )),
    ).subscribe({
      next: (res) => this.openModal({id, content: res, activate: true}),
      error: error => {
        error.errorMessages.forEach((err: any) => {
          err
            ? this.translateService.showMessage(MESSAGE.error_plan_is_for_activate)
            : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
        });
      },
    });
  }

  putData(id: number) {
    this.sharedService.isForEdit(id, Components.PLANS).pipe(
      switchMap(() => this.service.getById(id).pipe(
        catchError( error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(err)
              : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
          });
          return EMPTY;
        }),
      )),
    ).subscribe({
      next: (res) => this.edit(id, res),
      error: error => {
        error.errorMessages.forEach((err: any) => {
          err ? this.translateService.showMessage(err) : this.translateService.showMessage(MESSAGE.plan_editable_error);
        });
      },
    });
  }

  edit(id: number, res: any) {
    this.dialog.open(AddPlanComponent, {
      width: '1024px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      data: {
        plansData: res,
        id: id,
      },
    });
  }

  openCutModal(element: PlanHeader) {
    this.service.isForCut(element.id).pipe(
      switchMap(() => this.service.getCutPlanInterval(element.id).pipe(
        catchError( error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(err)
              : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
          });
          return of({} as CutInterval);
        })
      )),
    ).subscribe({
      next: (resInterval) => {
        this.dialog.open(CutPlanComponent, {
          width: '480px',
          minHeight: 'auto',
          panelClass: 'custom-dialog-container',
          data: {
            data: element,
            dataInterval: resInterval,
          },
          autoFocus: false,
        });
      },
      error: error => {
        error.errorMessages.forEach((err: any) => {
          err
            ? this.translateService.showMessage(MESSAGE.error_plan_is_for_cut)
            : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
        });
      },
    });
  }

  isCutEnabled(plan: PlanHeader): boolean {
    const endDateFormat = dayjs(plan.planInterval.endDate).format('YYYY-MM-DD');
    const currentDate = dayjs(new Date()).format('YYYY-MM-DD');

    return plan.active && (typeof plan.cutDate === 'undefined' || plan.cutDate === null) && currentDate < endDateFormat;
  }

  isActivationEnabled(plan: PlanHeader): boolean {
    const currentDateFormat = dayjs(new Date()).format('YYYY-MM-DD');
    const endDateFormat = dayjs(plan.planInterval.endDate).format('YYYY-MM-DD');
    return !plan.active && endDateFormat > currentDateFormat;
  }

  openDialog() {
    this.modal = true;
    this.dialog.open(AddPlanComponent, {
      width: '1024px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });
  }

  deleteDialog(element: any) {
    this.sharedService.isForEdit(element.id, Components.PLANS).subscribe({
      next: () => {
        this.dialog.open(DeleteModalComponent, {
          width: '400px',
          height: 'auto',
          data: { component: Components.PLANS, data: element },
          position: { top: '15%', left: '42%' },
        });
      },
      error: error => {
        error.errorMessages.forEach((err: any) => {
          err
            ? this.translateService.showMessage(MESSAGE.plan_editable_error)
            : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
        });
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
