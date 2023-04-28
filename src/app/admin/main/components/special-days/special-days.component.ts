import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { DeleteModalComponent } from '../../../../modals/delete-modal/delete-modal.component';
import { Components } from '../../../../utils/enums';
import { SharedService } from '../../../../services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { SpecialDayService } from '../../../../services/special-day.service';
import { SpecialDaysModalComponent } from './special-days-modal/special-days-modal.component';
import { SpecialDays } from '../../../../models/special-days.model';
import { MatSort } from '@angular/material/sort';
import { SearchComponent } from '../reusable-component/search/search.component';
import { GridModal } from '../../../../models/grid-modal';

@Component({
  selector: 'app-special-days',
  templateUrl: './special-days.component.html',
  styleUrls: ['./special-days.component.scss'],
})
export class SpecialDaysComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchComponent) search: SearchComponent;

  total = 0;
  data: SpecialDays[];
  isLoadingResults = true;

  displayedColumns: string[] = ['ID_SPECIAL_DAY', 'DAY', 'MONTH', 'YEAR', 'NAME', 'ACTION'];
  subscription: Subscription = new Subscription();

  constructor(private sharedService: SharedService, private service: SpecialDayService, private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page, this.search.searchBox, this.sharedService.gridReload$)
        .pipe(
          startWith({}),
          switchMap(events => {
            this.isLoadingResults = true;
            if (typeof events === 'object' && events.hasOwnProperty('searchText')) {
              this.paginator.pageIndex = 0;
            }
            return this.service.search(
              this.search.searchText,
              this.paginator.pageIndex,
              this.paginator.pageSize,
              this.sort.active,
              this.sort.direction,
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
        )
        .subscribe(data => (this.data = data)),
    );
  }

  getById(id: number) {
    this.subscription.add(this.service.getById(id).subscribe(res => this.openDialog({ id, content: res })));
  }

  openDialog(modalData?: GridModal<SpecialDays>) {
    this.dialog.open(SpecialDaysModalComponent, {
      width: '480px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  deleteDialog(element: SpecialDays) {
    this.dialog.open(DeleteModalComponent, {
      width: '290px',
      height: 'auto',
      data: { component: Components.SPECIAL_DAY, data: element },
      position: { top: '15%', left: '42%' },
    });
  }

  checkYear(year: any) {
    return year === 0 ? '' : year;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
