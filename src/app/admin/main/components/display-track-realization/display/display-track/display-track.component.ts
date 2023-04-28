import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RxStompState } from '@stomp/rx-stomp';
import { combineLatest, concatMap, delay, filter, interval, map, Observable, of, shareReplay, Subscription, switchMap, tap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StationTrackRealizationResponse } from 'src/app/models/display-realization.model';
import { RealizationService } from 'src/app/services/realization.service';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';

export enum ShowElement {
  NONE,
  DISPLAY,
  WELCOME,
  OUT_OF_ORDER,
}

@Component({
  selector: 'app-display-track',
  templateUrl: './display-track.component.html',
  styleUrls: ['./display-track.component.scss'],
})
export class DisplayTrackComponent implements OnInit, OnDestroy {
  data: StationTrackRealizationResponse;
  logoUrl: string;
  currentTime: string = '';
  currentDate: string = '';
  outOfOrder: Subscription = Subscription.EMPTY;
  ping: Subscription = Subscription.EMPTY;
  subscription: Subscription = new Subscription();
  OUT_OF_ORDER_INTERVAL = 30000;
  PING_INTERVAL = 1*60*1000;
  PING_INTERVAL_DELAY = 1*50*1000;
  activeTrackStatus: ShowElement = ShowElement.NONE;
  trackStatus = ShowElement;
  stationId: number;
  track: number;
  infoTableId: number;

  queryParams$: Observable<Params> = this.activatedRoute.queryParams.pipe(
    filter(params => !!params['station-id'] && !!params['track'] && !!params['info-table-id']),
    tap((params) => {
      this.stationId = params['station-id'];
      this.track = params['track'];
      this.infoTableId = params['info-table-id'];
    }),
    shareReplay(1),
  );

  watchStationTrack$: Observable<string> = this.queryParams$.pipe(
    switchMap(params =>
      this.rxStompService.watch(`/s${params['station-id']}/t${params['track']}`).pipe(
        map(response => response.body),
      )
    ),
  );

  connectionState$ = this.rxStompService.connectionState$;

  isConnected$: Observable<boolean> = this.connectionState$.pipe(
    map(state => state === RxStompState.OPEN),
  );

  isClosed$ = this.connectionState$.pipe(
    filter(state => state === RxStompState.CLOSED),
  );

  indicator$: Observable<'OPEN' | 'CLOSED'> = this.connectionState$.pipe(
    map(state => state === RxStompState.OPEN ? 'OPEN' : 'CLOSED'),
  );

  getInitialData$: Observable<StationTrackRealizationResponse> = combineLatest([
    this.rxStompService.connected$,
    this.queryParams$,
  ]).pipe(
    switchMap(([,params]) =>
      this.getData(params['station-id'], params['track'])
    ),
  );

  constructor(
    private realizationService: RealizationService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private rxStompService: RxStompService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.rxStompService.connected$.subscribe(() => this.connectedDisplay())
    );

    this.subscription.add(
      this.isClosed$.subscribe(() => this.disconnectedDisplay())
    );

    this.subscription.add(
      this.getInitialData$.subscribe({
        next: res => {
          this.data = res;
          if (res.stationRealizationItem !== null) {
            this.logoUrl = `${environment.baseUrl}/operators/${res.stationRealizationItem?.train?.operator?.id}/logo`;
            this.activeTrackStatus = ShowElement.DISPLAY;
          } else {
            this.activeTrackStatus = ShowElement.WELCOME;
          }
        },
        error: (error: any) => {
          this.activeTrackStatus = ShowElement.OUT_OF_ORDER;
          if (error && error.errorMessages) {
            error.errorMessages.forEach((err: any) => {
              err ? this.translateService.showMessage(err) : this.translateService.showMessage(MESSAGE.RUNTIME_ERROR);
            });
          }
        },
      })
    );

    this.subscription.add(
      this.watchStationTrack$.subscribe({
        next: res => {
          this.data = JSON.parse(res);
          this.rxStompService.publish({
            destination: '/monitor',
            body: JSON.stringify({
              infoTableId: this.infoTableId,
              type: "ACKNOWLEDGE",
              stationId: this.stationId,
              infoTableType: "TRACK",
              track: this.track
            }),
            retryIfDisconnected: false,
          })
        },
        error: () => this.activeTrackStatus = ShowElement.OUT_OF_ORDER,
      })
    );

    this.subscription.add(
      timer(0, 1000).pipe(
        tap(() => this.updateDateAndTime())
      ).subscribe()
    );

  }

  protected randomDelay(min: number, max: number) {
    return (Math.floor(Math.random() * ((max - min) + 1)) + min);
  }

  delay(): number {
    if (this.data.stationRealizationItem.realizationItem.departureDelay != null) {
      return this.data.stationRealizationItem.realizationItem.departureDelay;
    } else if (this.data.stationRealizationItem.realizationItem.arrivalDelay != null) {
      return this.data.stationRealizationItem.realizationItem.arrivalDelay;
    } else {
      return 0;
    }
  }

  protected disconnectedDisplay() {
    if (this.outOfOrder.closed) {
      console.log('timer started....');
      this.outOfOrder = timer(this.OUT_OF_ORDER_INTERVAL).subscribe({
        next: () => {
          console.log('out of order....');
          this.activeTrackStatus = ShowElement.OUT_OF_ORDER;
        },
        complete: () => console.log('subscription is complete'),
      });
    }
    this.ping?.unsubscribe();
  }

  protected connectedDisplay() {
    console.log('timer stopped...');
    this.outOfOrder?.unsubscribe();

    if (this.ping.closed) {
      this.ping = interval(this.PING_INTERVAL).pipe(
        concatMap((i) =>
          of(i).pipe(
            delay(this.randomDelay(0, this.PING_INTERVAL_DELAY))
          )
        ),
      ).subscribe(() =>
        this.rxStompService.publish({
          retryIfDisconnected: false,
          destination: '/monitor',
          body: JSON.stringify({
            infoTableId: this.infoTableId,
            type: "PING",
            stationId: this.stationId,
            infoTableType: "TRACK",
            track: this.track
          }),
        })
      );
    }
  }

  protected updateDateAndTime() {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
    const date = currentTime.getDate().toString().padStart(2, '0');
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;
    this.currentDate = `${year}-${month}-${date}`;
  }

  protected getData(stationId: number, track: number): Observable<StationTrackRealizationResponse> {
    return this.realizationService.get(stationId, track);
  }

  ngOnDestroy() {
    this.outOfOrder.unsubscribe();
    this.ping.unsubscribe();
    this.subscription.unsubscribe();
  }
}
