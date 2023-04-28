import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { JobsService } from 'src/app/services/jobs.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';
import { MatSort } from '@angular/material/sort';
import { Job } from '../../../../models/jobs.model';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
  providers: [JobsService],
})
export class JobsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  total = 0;
  data: Job[];
  isLoadingResults = true;

  displayedColumns: string[] = ['ID', 'TYPE', 'STATUS', 'ERROR', 'CREATED_DATE', 'UPDATE_DATE'];
  subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private service: JobsService,
    private translateService: TranslateService,
  ) {}

  ngAfterViewInit(): void {
    this.subscription.add(
      merge(
        this.sort.sortChange,
        this.paginator.page,
        this.sharedService.gridReload$
      ).pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.search(
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
      ).subscribe({
        next: data => this.data = data,
        error: (error: any) => {
          error.message
            ? this.translateService.showMessage(error.message)
            : this.translateService.showMessage(MESSAGE.error_jobs);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
