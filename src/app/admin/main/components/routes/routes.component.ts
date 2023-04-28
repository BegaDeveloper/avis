import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';
import { RoutesService } from 'src/app/services/routes.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { Components } from 'src/app/utils/enums';
import { MESSAGE } from 'src/app/utils/messages';
import { AddRouteComponent } from './add-route/add-route.component';
import { Route, RouteItem } from '../../../../models/routes.model';
import { SearchComponent } from '../reusable-component/search/search.component';
import { GridModal } from '../../../../models/grid-modal';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchComponent) search: SearchComponent;

  total = 0;
  data: Route[];
  isLoadingResults = true;

  displayedColumns: string[] = ['ID', 'NAME', 'STATION', 'ACTION'];
  private subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private service: RoutesService,
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

  returnStations(routeItems: RouteItem[]) {
    return routeItems.map(item => item.station.name).join(', ');
  }

  getById(id: number) {
    this.subscription.add(
      this.sharedService.isForEdit(id, Components.ROUTES).pipe(
        switchMap(() => this.service.getById(id)),
      ).subscribe({
        next: (res) => {
          this.openModal({id, content: res});
        },
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(MESSAGE.route_editable_error)
              : this.translateService.showMessage(MESSAGE.error_interval_search);
          });
        },
      }),
    );
  }

  openModal(modalData?: GridModal<Route>) {
    this.dialog.open(AddRouteComponent, {
      width: '650px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  deleteDialog(element: Route) {
    this.subscription.add(
      this.sharedService.isForEdit(element.id, Components.ROUTES).subscribe({
        next: () => {
          this.dialog.open(DeleteModalComponent, {
            width: '290px',
            height: 'auto',
            data: { component: Components.ROUTES, data: element },
            position: { top: '15%', left: '42%' },
          });
        },
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(MESSAGE.route_editable_error)
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
