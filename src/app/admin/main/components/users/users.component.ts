import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/utils/messages';
import { UserModalComponent } from './user-modal/user-modal.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserStationComponent } from './user-station/user-station.component';
import { SearchComponent } from '../reusable-component/search/search.component';
import { User } from '../../../../models/user.model';
import { GridModal } from '../../../../models/grid-modal';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchComponent) search: SearchComponent;

  total = 0;
  data: User[];
  isLoadingResults = true;

  displayedColumns: string[] = ['ID', 'USERNAME', 'FULL_NAME', 'ENABLED', 'STATIONS', 'USERS', 'AKCIJA'];
  subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private service: UserService,
    private dialog: MatDialog,
    private translateService: TranslateService,
  ) {}

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

  openDialog(modalData?: GridModal<User>) {
    this.dialog.open(UserModalComponent, {
      width: '480px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  openRoleDialog(modalData?: GridModal<User>) {
    this.dialog.open(UserRoleComponent, {
      width: '600px',
      height: '250px',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  openStationDialog(modalData?: GridModal<User>) {
    this.dialog.open(UserStationComponent, {
      width: '650px',
      minHeight: '400px',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  manage(id: number, name?: string) {
    this.subscription.add(
      this.service.getById(id).subscribe({
        next: res => {
          if (name == 'role') this.openRoleDialog({ id, content: res });
          if (name == 'station') this.openStationDialog({ id, content: res });
          if (!name) this.openDialog({ id, content: res });
        },
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(err)
              : this.translateService.showMessage(MESSAGE.error_user_role_load);
          });
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
