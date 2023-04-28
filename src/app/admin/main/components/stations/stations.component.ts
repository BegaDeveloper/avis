import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import { DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { StationService } from 'src/app/services/station.service';
import { Components } from 'src/app/utils/enums';
import { StationModalComponent } from './station-modal/station-modal.component';
import { StationTrackComponent } from './station-track/station-track.component';
import { TranslateService } from '../../../../services/translate.service';
import { MESSAGE } from '../../../../utils/messages';
import { StationSubsequentComponent } from './station-subsequent/station-subsequent.component';
import { StationPremisesComponent } from './station-premises/station-premises.component';
import { MatSort } from '@angular/material/sort';
import { SearchComponent } from '../reusable-component/search/search.component';
import { StationModalData, Station, Track, SubsequentStation, Premise } from '../../../../models/stations.model';
import { GridModal } from '../../../../models/grid-modal';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss'],
})
export class StationsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchComponent) search: SearchComponent;

  data: Station[];
  total = 0;
  isLoadingResults = true;

  displayedColumns: string[] = ['ID', 'STATIONTYPE', 'NAZIV STANICE', 'LICENCA', 'EXTERNI ID', 'AKCIJA'];
  private subscription: Subscription = new Subscription();

  idData: boolean = false;
  id: number;

  constructor(
    private sharedService: SharedService,
    private service: StationService,
    private dialog: MatDialog,
    private router: Router,
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

  addTrack(id: number, stationName: string) {
    this.subscription.add(
      this.service.getTrackById(id).subscribe({
        next: res => {
          this.openDialogTrack({id, name: stationName, content: res});
        },
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err ? this.translateService.showMessage(err) : this.translateService.showMessage(MESSAGE.error_tracks_load);
          });
        },
      })
    );
  }

  addSubsequentStation(id: number, stationName: string) {
    this.subscription.add(
      this.service.getSubsequentStations(id).subscribe({
        next: res => this.openDialogSubStations({id, name: stationName, content: res}),
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(err)
              : this.translateService.showMessage(MESSAGE.error_subsequent_station_load);
          });
        },
      })
    );
  }

  addStationPremises(id: number, stationName: string) {
    this.subscription.add(
      this.service.getStationPremises(id).subscribe({
        next: res =>
          this.openDialogPremises({id, name: stationName, content: res}),
        error: error => {
          error.errorMessages.forEach((err: any) => {
            err
              ? this.translateService.showMessage(err)
              : this.translateService.showMessage(MESSAGE.error_premises_station_load);
          });
        },
      })
    );
  }

  getById(id: number) {
    this.subscription.add(
      this.service.getById(id).subscribe(res =>
        this.openDialog({id, content: res})
      )
    );
  }

  openDialogSubStations(modalData: StationModalData<SubsequentStation>) {
    this.dialog.open(StationSubsequentComponent, {
      width: '650px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  openDialogPremises(modalData: StationModalData<Premise>) {
    this.dialog.open(StationPremisesComponent, {
      width: '650px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  openDialogTrack(modalData: StationModalData<Track>) {
    this.dialog.open(StationTrackComponent, {
      width: '650px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  openDialog(modalData?: GridModal<Station>) {
    this.dialog.open(StationModalComponent, {
      width: '650px',
      minHeight: 'auto',
      panelClass: 'custom-dialog-container',
      data: modalData,
      autoFocus: false,
    });
  }

  deleteDialog(element: Station) {
    this.sharedService.isForDelete(element.id, Components.STATION).subscribe({
      next: () => {
        this.dialog.open(DeleteModalComponent, {
          width: '320px',
          height: 'auto',
          data: { component: Components.STATION, data: element },
          position: { top: '15%', left: '42%' },
        });
      },
      error: error => {
        error.errorMessages.forEach((err: any) => {
          err
            ? this.translateService.showMessage(MESSAGE.error_station_is_for_delete)
            : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
