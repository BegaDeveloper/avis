import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { AudioController } from '../../../../models/audio-controller';
import { AudioControllerService } from '../../../../services/audio-controller.service';
import { SharedService } from '../../../../services/shared.service';
import { SearchComponent } from '../reusable-component/search/search.component';
import { AudioControllerEditComponent } from './edit/audio-controller-edit.component';

@Component({
  selector: 'app-audio-controller',
  templateUrl: './audio-controller.component.html',
  styleUrls: ['./audio-controller.component.scss'],
})
export class AudioControllerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchComponent) search: SearchComponent;
  displayedColumns: string[] = ['ID', 'NAME', 'API_URL', 'ENABLED', 'ACTION'];
  total = 0;
  data: AudioController[];
  private subscription: Subscription = new Subscription();
  constructor(
    private sharedService: SharedService,
    private service: AudioControllerService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page, this.search.searchBox, this.sharedService.gridReload$)
        .pipe(
          startWith({}),
          switchMap(events => {
            if (typeof events === 'object' && events.hasOwnProperty('searchText')) {
              this.paginator.pageIndex = 0;
            }
            return this.service.search(
              this.paginator.pageIndex,
              this.paginator.pageSize,
              this.sort.active,
              this.sort.direction,
              this.search.searchText,
            );
          }),
          map(data => {
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

  getById(ac: AudioController) {
    this.dialog.open(AudioControllerEditComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        id: ac.id,
        content: { name: ac.name, enabled: ac.enabled },
      },
      autoFocus: false,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
