import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';
import { TrainService } from 'src/app/services/train.service';
import { SharedService } from 'src/app/services/shared.service';
import { Components } from 'src/app/utils/enums';
import { TrainModalComponent } from './train-modal/train-modal.component';
import { TranslateService } from '../../../../services/translate.service';
import { MESSAGE } from '../../../../utils/messages';
import { Train } from '../../../../models/trains.modal';
import { SearchComponent } from '../reusable-component/search/search.component';
import { GridModal } from '../../../../models/grid-modal';

@Component({
  selector: 'app-trains',
  templateUrl: './trains.component.html',
  styleUrls: ['./trains.component.scss'],
})
export class TrainsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchComponent) search: SearchComponent;

  total = 0;
  data: Train[];
  isLoadingResults = true;

  displayedColumns: string[] = ['ID TRAIN', 'OPERATOR_NAME', 'CATEGORY_NAME', 'TRAIN_NAME', 'AKCIJA'];
  subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private service: TrainService,
    private dialog: MatDialog,
    private translateService: TranslateService,
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

  getById(id: number) {
    this.subscription.add(
      this.service.getById(id).subscribe(res =>
        this.openDialog({id, content: res})
      )
    );
  }

  openDialog(modalData?: GridModal<Train>) {
    this.dialog.open(TrainModalComponent, {
      width: '480px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  deleteDialog(element: Train) {
    this.subscription.add(
      this.sharedService.isForDelete(element.id, Components.TRAINS).subscribe({
        next: () => {
          this.dialog.open(DeleteModalComponent, {
            width: '290px',
            height: 'auto',
            data: { component: Components.TRAINS, data: element },
            position: { top: '15%', left: '42%' },
          });
        },
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(MESSAGE.error_train_is_for_delete)
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
