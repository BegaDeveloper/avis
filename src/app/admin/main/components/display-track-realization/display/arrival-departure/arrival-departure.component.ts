import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxStompState } from '@stomp/rx-stomp';
import { combineLatest, exhaustMap, filter, iif, map, Observable, Subscription, switchMap, tap, timer } from 'rxjs';
import { EventType } from 'src/app/models/arrival-departure.model';
import { ActionsService } from 'src/app/services/actions.service';
import { environment } from 'src/environments/environment';
import { StationArrivalDepartureRealization, StationRealizationItem } from '../../../../../../models/realization.model';
import { RxStompService } from 'src/app/services/rx-stomp.service';
import { Station } from 'src/app/models/stations.model';

@Component({
  selector: 'app-arrival-departure',
  templateUrl: './arrival-departure.component.html',
  styleUrls: ['./arrival-departure.component.scss'],
})
export class ArrivalDepartureComponent implements OnInit, OnDestroy {
  currentDate: string = '';
  time: string | null;
  isArrivalsDisplay: boolean = false;
  isDeparturesDisplay: boolean = false;
  isDepartureAndArrival: boolean = false;
  stationId: number;
  isConnected: boolean;
  type: EventType;
  size: number = 10;
  url: string = environment.baseUrl;
  data: StationRealizationItem[];
  station: Station;

  queryParams$: Observable<{ stationId: number; url: string }> = this.activatedRoute.queryParams.pipe(
    filter(params => !!params['station-id']),
    switchMap(params =>
      this.activatedRoute.url.pipe(
        filter(url => !!url[0]?.path),
        map(url => ({ stationId: params['station-id'], url: url[0].path })),
      ),
    ),
    tap(params => {
      this.stationId = params.stationId;
      this.isArrivalsDisplay = params.url === 'arrivals-display';
      this.isDeparturesDisplay = params.url === 'departures-display';
      this.isDepartureAndArrival = params.url == 'departures-arrivals-display';
      if (this.isDepartureAndArrival) {
        this.type = EventType.ARRIVAL_DEPARTURE;
      } else if (this.isArrivalsDisplay) {
        this.type = EventType.ARRIVAL;
      } else if (this.isDeparturesDisplay) {
        this.type = EventType.DEPARTURE;
      }
    }),
  );

  getInitialData$: Observable<StationArrivalDepartureRealization> = combineLatest([
    this.queryParams$,
    this.rxStompService.connectionState$,
  ]).pipe(
    tap(([, state]) => {
      switch (state) {
        case RxStompState.OPEN:
          this.isConnected = true;
          break;
        case RxStompState.CLOSED:
          this.isConnected = false;
          break;
      }
    }),
    switchMap(() =>
      iif(
        () => this.isDepartureAndArrival,
        timer(0, 60000).pipe(
          exhaustMap(() =>
            this.actionService
              .getArrivalDepartureRealizations(this.stationId, this.type, this.size)
              .pipe(tap(() => (this.isArrivalsDisplay = !this.isArrivalsDisplay))),
          ),
        ),
        this.actionService.getArrivalDepartureRealizations(this.stationId, this.type, this.size),
      ),
    ),
    tap((res: StationArrivalDepartureRealization) => {
      this.station = res.station;
      if (this.isArrivalsDisplay) {
        this.data = res.arrivals;
      } else {
        this.data = res.departures;
      }
    }),
  );

  watchStationTrack$: Observable<StationArrivalDepartureRealization> = this.queryParams$.pipe(
    switchMap(() =>
      this.rxStompService.watch(`/s${this.stationId}/ad`).pipe(map(response => JSON.parse(response.body))),
    ),
  );
  subscription: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private actionService: ActionsService,
    private rxStompService: RxStompService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(this.getInitialData$.subscribe());
    this.subscription.add(
      this.watchStationTrack$.subscribe(
        response => (this.data = this.isArrivalsDisplay ? response.arrivals : response.departures),
      ),
    );
    this.subscription.add(
      timer(0, 1000)
        .pipe(
          tap(() => {
            this.updateTime();
            this.updateDate();
          }),
        )
        .subscribe(),
    );
  }

  updateTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    this.time = `${hours}:${minutes}`;
  }

  updateDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const date = currentDate.getDate().toString().padStart(2, '0');
    this.currentDate = `${date}.${month}.${year}.`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
