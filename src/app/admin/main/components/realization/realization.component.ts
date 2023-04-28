import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { map, merge, Observable, shareReplay, Subscription, switchMap } from 'rxjs';
import { RealizationService } from 'src/app/services/realization.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/utils/messages';
import { ActionsObject, StationRealizationItem } from '../../../../models/realization.model';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { RealizationDetailsComponent } from './realization-details/realization-details.component';
import { Station } from 'src/app/models/stations.model';
import { StartPostponeActionComponent } from './start-postpone-action/start-postpone-action.component';
import { ResetCancelActionComponent } from './reset-cancel-action/reset-cancel-action.component';
import { ArrivalsDeparturesComponent } from './arrivals-departures/arrivals-departures.component';
import { ChangeTrackComponent } from './change-track/change-track.component';
import { ActionStatus, EventTypes } from '../../../../utils/enums';
import { RouteShorteningComponent } from './route-shortening/route-shortening.component';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ComponentType } from '@angular/cdk/overlay';
const SELECTED_STATION_KEY = 'selected_station';
import { translationActions } from '../../../../models/realization.model';
import { SearchComponent } from '../reusable-component/search/search.component';

@Component({
  selector: 'app-realization',
  templateUrl: './realization.component.html',
  styleUrls: ['./realization.component.scss'],
})
export class RealizationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSelect) select: MatSelect;
  @ViewChild(MatCheckbox) checkbox: MatCheckbox;
  @ViewChild(SearchComponent) search: SearchComponent;
  url: string = environment.baseUrl;
  pageSize: number = 10;
  total: number;
  data: StationRealizationItem[];

  displayedColumns: string[] = [
    'ID',
    'OPERATOR',
    'CATEGORY',
    'TRAIN',
    'TRANZIT',
    'ROUTE',
    'KOLOSEK',
    'TIME_ARRIVAL',
    'TIME_DEPARTURE',
    'ARRIVAL_DELAY',
    'DEPARTURE_DELAY',
    'STATUS',
    'ACTION_STATUS',
    'ACTIONS',
  ];
  subscription: Subscription = new Subscription();
  selectedStation: Station;

  private _initialData: EventEmitter<void> = new EventEmitter<void>();
  stations$: Observable<Station[]> = this.userService.getAuthUserStations().pipe(shareReplay(1));

  iconPaths: ActionsObject = {
    START: '/assets/icons/start.svg',
    POSTPONE: '/assets/icons/postpone.svg',
    CANCEL: '/assets/icons/cancel.svg',
    NOTIFICATION: '/assets/icons/notification.svg',
    CHANGE_TRACK: '/assets/icons/change_track.svg',
    ARRIVAL: '/assets/icons/arrival.svg',
    DEPARTURE: '/assets/icons/departure.svg',
    CHANGE_ARRIVAL_DELAY: '/assets/icons/change-arrival-delay.svg',
    CHANGE_DEPARTURE_DELAY: '/assets/icons/change-departure-delay.svg',
    RESET: '/assets/icons/reset.svg',
    SHORTENING: '/assets/icons/shortening.svg',
  };

  actionStatus = ActionStatus;

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private service: RealizationService,
    private dialog: MatDialog,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.stations$.subscribe(stations => {
      const selected = window.localStorage.getItem(SELECTED_STATION_KEY);
      if (selected) {
        const selectedStation = JSON.parse(selected) as Station;
        if (stations.some(station => station.id === selectedStation.id)) {
          this.selectedStation = selectedStation;
          this._initialData.emit();
        }
      } else if (stations.length === 1) {
        this.selectedStation = stations[0];
        this._initialData.emit();
      }
    });
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      merge(
        this.paginator.page,
        this.select.selectionChange,
        this.checkbox.change,
        this.search.searchBox,
        this._initialData,
        this.sharedService.gridReload$,
      )
        .pipe(
          switchMap(events => {
            if (
              events instanceof MatCheckboxChange ||
              events instanceof MatSelectChange ||
              (typeof events === 'object' && events.hasOwnProperty('searchText'))
            ) {
              this.paginator.pageIndex = 0;
            }
            return this.service.search(
              this.selectedStation.id,
              this.checkbox.checked,
              this.paginator.pageIndex,
              this.paginator.pageSize,
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
        .subscribe({
          next: data => (this.data = data),
          error: (error: any) => {
            error.message
              ? this.translateService.showMessage(error.message)
              : this.translateService.showMessage(MESSAGE.error_get_realization);
          },
        }),
    );
  }

  loadData() {
    this.sharedService.reloadGrid();
  }

  getTranslation(action: string): string {
    return translationActions[action];
  }

  compareStations(s1: any, s2: any) {
    return s1 && s2 && s1.id === s2.id;
  }

  storeSelectedStation() {
    window.localStorage.setItem(SELECTED_STATION_KEY, JSON.stringify(this.selectedStation));
  }

  openDetail(id: number) {
    this.subscription.add(
      this.service.getRealizationDetails(id).subscribe({
        next: data => {
          this.dialog.open(RealizationDetailsComponent, {
            width: '850px',
            minHeight: 'auto',
            panelClass: 'custom-dialog-container',
            data: {
              id: id,
              data: data,
            },
            autoFocus: false,
          });
        },
        error: error => {
          error?.errorMessages?.forEach((err: any) => {
            err
              ? this.translateService.showMessage(err)
              : this.translateService.showMessage(MESSAGE.error_get_realization);
          });
        },
      }),
    );
  }

  //Actions
  openActionDialog(action: EventTypes, id: number) {
    let dialogComponent: ComponentType<
      | StartPostponeActionComponent
      | ResetCancelActionComponent
      | ArrivalsDeparturesComponent
      | ChangeTrackComponent
      | RouteShorteningComponent
    >;
    switch (action) {
      case EventTypes.START:
      case EventTypes.POSTPONE:
        dialogComponent = StartPostponeActionComponent;
        break;
      case EventTypes.RESET:
      case EventTypes.CANCEL:
        dialogComponent = ResetCancelActionComponent;
        break;
      case EventTypes.ARRIVAL:
      case EventTypes.DEPARTURE:
      case EventTypes.CHANGE_ARRIVAL_DELAY:
      case EventTypes.CHANGE_DEPARTURE_DELAY:
        dialogComponent = ArrivalsDeparturesComponent;
        break;
      case EventTypes.CHANGE_TRACK:
        dialogComponent = ChangeTrackComponent;
        break;
      case EventTypes.SHORTENING:
        dialogComponent = RouteShorteningComponent;
        break;
    }

    if (dialogComponent) {
      this.dialog.open(dialogComponent, {
        width: '680px',
        minHeight: 'auto',
        panelClass: 'custom-dialog-container',
        data: {
          id: id,
          action: action,
          selectedStation: this.selectedStation,
        },
        autoFocus: false,
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
