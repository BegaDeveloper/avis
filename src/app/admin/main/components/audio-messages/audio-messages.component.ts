import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { merge, Observable, shareReplay, Subscription, switchMap } from 'rxjs';
import { AudioMessageData } from 'src/app/models/audio-message.model';
import { Station } from 'src/app/models/stations.model';
import { AudioMessageService } from 'src/app/services/audio-message.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/utils/messages';
const SELECTED_STATION_KEY = 'selected_station';

@Component({
  selector: 'app-audio-messages',
  templateUrl: './audio-messages.component.html',
  styleUrls: ['./audio-messages.component.scss'],
})
export class AudioMessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription = new Subscription();
  private initialData = new EventEmitter<void>();
  public stations$: Observable<Station[]> = this.userService.getAuthUserStations().pipe(shareReplay(1));
  public selectedStation: Station;
  public audioMessageData: AudioMessageData[] = [];
  public pageSize = 10;
  public total: number;
  public pageNumber = 0;
  public displayedColumns: string[] = ['ID', 'DATE', 'TRAIN', 'ROUTE_NAME', 'TRACK', 'MESSAGE'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSelect) select: MatSelect;

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private audioMessageService: AudioMessageService,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.stations$.subscribe(stations => {
        const selected = window.localStorage.getItem(SELECTED_STATION_KEY);
        if (selected) {
          const selectedStation = JSON.parse(selected) as Station;
          if (stations.some(station => station.id === selectedStation.id)) {
            this.selectedStation = selectedStation;
            this.initialData.emit();
          }
        } else if (stations.length === 1) {
          this.selectedStation = stations[0];
          this.initialData.emit();
        }
      }),
    );
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      merge(this.paginator.page, this.select.selectionChange, this.initialData, this.sharedService.gridReload$)
        .pipe(
          switchMap(events => {
            if (events instanceof MatSelectChange) {
              this.paginator.pageIndex = 0;
            }
            return this.audioMessageService.get(
              this.selectedStation.id,
              this.paginator.pageIndex,
              this.paginator.pageSize,
              'emittingDateFrom',
              'ASC',
            );
          }),
        )
        .subscribe({
          next: data => {
            if (data) {
              this.total = data.totalElements;
              this.audioMessageData = data.content;
            } else {
              this.audioMessageData = [];
            }
          },
          error: (error: any) => {
            this.translateService.showMessage(error?.message || MESSAGE.error_get_realization);
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  compareStations(s1: any, s2: any) {
    return s1 && s2 && s1.id === s2.id;
  }

  storeSelectedStation(): void {
    window.localStorage.setItem(SELECTED_STATION_KEY, JSON.stringify(this.selectedStation));
  }
}
