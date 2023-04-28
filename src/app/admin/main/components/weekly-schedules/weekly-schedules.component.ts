import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { WeeklySchedulesService } from 'src/app/services/weekly-schedules.service';
import { Components, SpecialDayEnum } from 'src/app/utils/enums';
import { AddWeeklyScheduleComponent } from './add-weekly-schedule/add-weekly-schedule.component';
import { TranslateService } from '../../../../services/translate.service';
import { MESSAGE } from '../../../../utils/messages';
import { WeeklySchedule } from '../../../../models/weekly.model';
import { SearchComponent } from '../reusable-component/search/search.component';
import { GridModal } from '../../../../models/grid-modal';

@Component({
  selector: 'app-weekly-schedules',
  templateUrl: './weekly-schedules.component.html',
  styleUrls: ['./weekly-schedules.component.scss'],
})
export class WeeklySchedulesComponent implements AfterViewInit, OnDestroy {
  specialDaysArray: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchComponent) search: SearchComponent;

  total = 0;
  data: WeeklySchedule[];
  isLoadingResults = true;

  displayedColumns: string[] = ['ID', 'NAME', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', 'SPECIAL_DAY', 'AKCIJA'];
  subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private service: WeeklySchedulesService,
    private dialog: MatDialog,
    public translateService: TranslateService,
  ) {}

  ngAfterViewInit(): void {
    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page, this.search.searchBox, this.sharedService.gridReload$)
        .pipe(
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

  returnSpecialDay(element: keyof typeof SpecialDayEnum) {
    return SpecialDayEnum[element];
  }

  getById(id: number) {
    this.subscription.add(
      this.sharedService.isForEdit(id, Components.WEEKLY_SCHEDULE).pipe(
        switchMap(() => this.service.getById(id)),
      ).subscribe({
        next: res => this.openDialog({id, content: res}),
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(MESSAGE.weekly_schedule_editable_error)
              : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
          });
        },
      }),
    );
  }

  openDialog(modalData?: GridModal<WeeklySchedule>) {
    this.dialog.open(AddWeeklyScheduleComponent, {
      width: '650px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  deleteDialog(element: WeeklySchedule) {
    this.subscription.add(
      this.sharedService.isForEdit(element.id, Components.WEEKLY_SCHEDULE).subscribe({
        next: () => this.dialog.open(DeleteModalComponent, {
          width: '290px',
          height: 'auto',
          data: { component: Components.WEEKLY_SCHEDULE, data: element },
          position: { top: '15%', left: '42%' },
        }),
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(MESSAGE.weekly_schedule_editable_error)
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
