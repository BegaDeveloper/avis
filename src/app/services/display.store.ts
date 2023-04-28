import { ComponentStore } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { map, Observable, pairwise } from 'rxjs';

export interface DisplayState {
  departure: Date | null;
  arrival: Date | null;
  departureDelay: number | null;
  arrivalDelay: number | null;
}

@Injectable()
export class DisplayStore extends ComponentStore<DisplayState> {
  constructor() {
    super({
      departure: null,
      arrival: null,
      departureDelay: null,
      arrivalDelay: null,
    });
  }

  readonly setDeparture = this.updater((state, value: Date) => ({
    ...state,
    departure: value,
  }));

  readonly setArrival = this.updater((state, value: Date) => ({
    ...state,
    arrival: value,
  }));

  readonly setDepartureDelay = this.updater((state, value: number) => ({
    ...state,
    departureDelay: value,
  }));

  readonly setArrivalDelay = this.updater((state, value: number) => ({
    ...state,
    arrivalDelay: value,
  }));

  readonly departure$: Observable<Date | null> = this.select(state => state.departure);
  readonly arrival$: Observable<Date | null> = this.select(state => state.arrival);
  readonly departureDelay$: Observable<number | null> = this.select(state => state.departureDelay);

  readonly arrivalDelay$: Observable<number | null> = this.select(state => state.arrivalDelay);

  readonly vm$ = this.select(
    this.departure$,
    this.arrival$,
    this.departureDelay$,
    this.arrivalDelay$,
    (departure, arrival, departureDelay, arrivalDelay) => ({
      departure,
      arrival,
      departureDelay,
      arrivalDelay,
    })
  );

  private readonly departureDelayChanges$ = this.state$.pipe(
    map((state) => state.departureDelay),
    pairwise()
  );

  private readonly arrivalDelayChanges$ = this.state$.pipe(
    map((state) => state.arrivalDelay),
    pairwise()
  );

  readonly changes$ = this.select(
    this.departureDelayChanges$,
    this.arrivalDelayChanges$,
    ([previousDepartureDelay, departureDelay], [previousArrivalDelay, arrivalDelay]) => ({
      departureDelay,
      previousDepartureDelay,
      arrivalDelay,
      previousArrivalDelay,
    }),
    { debounce: true }
  );

}
