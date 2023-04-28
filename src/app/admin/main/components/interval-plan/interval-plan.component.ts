import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';
import { IntervalPlanService } from 'src/app/services/interval-plan.service';
import { SharedService } from 'src/app/services/shared.service';
import { Components } from 'src/app/utils/enums';
import { IntervalModalComponent } from './interval-modal/interval-modal.component';
import { TranslateService } from '../../../../services/translate.service';
import { MESSAGE } from '../../../../utils/messages';
import { PlanInterval } from '../../../../models/plans.model';
import { SearchComponent } from '../reusable-component/search/search.component';
import { GridModal } from '../../../../models/grid-modal';

@Component({
  selector: 'app-interval-plan',
  templateUrl: './interval-plan.component.html',
  styleUrls: ['./interval-plan.component.scss'],
})
export class IntervalPlanComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchComponent) search: SearchComponent;

  total = 0;
  data: PlanInterval[];
  isLoadingResults = true;

  displayedColumns: string[] = ['ID_INTERVAL_PLAN', 'START_DATE', 'END_DATE', 'NAME', 'DESC', 'ACTION'];
  private subscription: Subscription = new Subscription();

  modal: MatDialogRef<IntervalModalComponent>;
  modalDelete: MatDialogRef<DeleteModalComponent>;

  constructor(
    protected sharedService: SharedService,
    protected service: IntervalPlanService,
    protected dialog: MatDialog,
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

  getById(id: number) {
    this.subscription.add(
      this.sharedService.isForEdit(id, Components.INTERVAL_PLAN).pipe(
        switchMap(() => this.service.getById(id)),
      ).subscribe({
        next: (res) => {
          this.openDialog({id, content: res});
        },
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(MESSAGE.plan_interval_editable_error)
              : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
          });
        },
      }),
    );
  }

  openDialog(modalData?: GridModal<PlanInterval>) {
    this.modal = this.dialog.open(IntervalModalComponent, {
      width: '480px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  deleteDialog(element: PlanInterval) {
    this.subscription.add(
      this.sharedService.isForEdit(element.id, Components.INTERVAL_PLAN).subscribe({
        next: () => {
          this.modalDelete = this.dialog.open(DeleteModalComponent, {
            width: '290px',
            height: 'auto',
            data: { component: Components.INTERVAL_PLAN, data: element },
            position: { top: '15%', left: '42%' },
          });
        },
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(MESSAGE.plan_interval_editable_error)
              : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
          });
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
