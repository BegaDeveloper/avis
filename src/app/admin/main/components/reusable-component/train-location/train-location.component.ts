import { Component, Input, OnInit } from '@angular/core';
import { Station } from '../../../../../models/stations.model';
import { RealizationDetailsItem } from '../../../../../models/realization.model';

export type LocationItemType = 'EMPTY' | 'TRAIN' | 'STATION' | 'SHORTENED';

export interface LocationItem {
  station?: Station;
  departure?: Date;
  departureDelay?: number;
  arrival?: Date;
  arrivalDelay?: number;
  status: LocationItemType;
  style?: string;
}

@Component({
  selector: 'app-train-location',
  templateUrl: './train-location.component.html',
  styleUrls: ['./train-location.component.scss'],
})
export class TrainLocationComponent implements OnInit {
  notStarted: boolean;
  canceled: boolean;
  trainLocations: LocationItem[];
  @Input() realizationDetailsItems: RealizationDetailsItem[];

  ngOnInit(): void {
    const realizationItems = this.realizationDetailsItems;
    this.trainLocations = this.getTrainLocationsFromRealizationItems(realizationItems);
  }

  private getTrainLocationsFromRealizationItems(realizationItems: RealizationDetailsItem[]) {
    const firstItem = realizationItems[0];
    const lastItem = realizationItems[realizationItems.length - 1];

    const shortenedItems = realizationItems.filter(item => item.realizationItemStatus === 'SHORTENED');
    const withoutShortenedItems = realizationItems.filter(item => !shortenedItems?.includes(item));

    const arrived = withoutShortenedItems.find(item => item.realizationItemStatus === 'ARRIVED');
    const indexOfArrived = withoutShortenedItems.findIndex(item => item.realizationItemStatus === 'ARRIVED');

    const reverse = [...withoutShortenedItems].reverse();
    const departed = reverse.find(item => item.realizationItemStatus === 'DEPARTED');
    const departedIndex = withoutShortenedItems.findIndex(item => item.id === departed?.id);

    const waitingIndex = withoutShortenedItems.findIndex(item => item.realizationItemStatus === 'WAITING');
    const inStation = arrived !== undefined;

    this.canceled = realizationItems.every(item => item.realizationItemStatus === 'CANCELED');
    this.notStarted =
      withoutShortenedItems.every(item => item.realizationItemStatus === 'WAITING') ||
      withoutShortenedItems.every(item => item.realizationItemStatus === 'UNKNOWN');

    const isShortenedFromStart = firstItem.realizationItemStatus === 'SHORTENED';
    const isShortenedAtEnd = lastItem.realizationItemStatus === 'SHORTENED';

    const firstAfterShorten = withoutShortenedItems[0];
    const lastAfterShorten = withoutShortenedItems[withoutShortenedItems.length - 1];

    const betweenStations = departedIndex !== -1 && departedIndex + 1 === waitingIndex;

    const p1 = inStation && indexOfArrived > 1;
    const b1 = betweenStations && departedIndex > 0;
    const showPrevious = p1 || b1;

    const p2 = inStation && indexOfArrived < withoutShortenedItems.length - 2;
    const b2 = betweenStations && departedIndex < withoutShortenedItems.length - 2;
    const showNext = p2 || b2;

    const previousItem: RealizationDetailsItem = p1
      ? withoutShortenedItems[indexOfArrived - 1]
      : b1
      ? (departed as RealizationDetailsItem)
      : ({} as RealizationDetailsItem);
    const nextItem: RealizationDetailsItem = p2
      ? withoutShortenedItems[indexOfArrived + 1]
      : b2
      ? withoutShortenedItems[departedIndex + 1]
      : ({} as RealizationDetailsItem);

    let trainLocation: LocationItem[] = [];

    // FIRST
    if (isShortenedFromStart) {
      trainLocation.push(
        {
          status: 'SHORTENED',
          station: firstItem.station,
        },
        {
          status: inStation && firstAfterShorten.id === arrived.id ? 'TRAIN' : 'STATION',
          style: 'FIRST',
          station: firstAfterShorten.station,
          arrival: firstAfterShorten.planTimeArrival,
          arrivalDelay: firstAfterShorten.arrivalDelay,
          departure: firstAfterShorten.planTimeDeparture,
          departureDelay: firstAfterShorten.departureDelay,
        },
      );
    } else {
      trainLocation.push({
        status: inStation && firstItem.id === arrived.id ? 'TRAIN' : 'STATION',
        style: 'FIRST',
        station: firstItem.station,
        departure: firstItem.planTimeDeparture,
        departureDelay: firstItem.departureDelay,
      });
    }

    if (this.notStarted || this.canceled) {
      trainLocation.push({ status: 'EMPTY' }, { status: 'EMPTY' });
    }

    if (showPrevious) {
      trainLocation.push({ status: 'EMPTY' });
      trainLocation.push({
        status: 'STATION',
        station: previousItem.station,
        arrival: previousItem.planTimeArrival,
        arrivalDelay: previousItem.arrivalDelay,
        departure: previousItem.planTimeDeparture,
        departureDelay: previousItem.departureDelay,
      });
    }

    if (
      arrived &&
      firstItem.id !== arrived.id &&
      firstAfterShorten.id !== arrived.id &&
      lastItem.id !== arrived.id &&
      lastAfterShorten.id !== arrived.id
    ) {
      trainLocation.push({
        status: 'TRAIN',
        station: arrived.station,
        arrival: arrived.planTimeArrival,
        arrivalDelay: arrived.arrivalDelay,
        departure: arrived.planTimeDeparture,
        departureDelay: arrived.departureDelay,
      });
    } else if (betweenStations) {
      trainLocation.push({
        status: 'TRAIN',
      });
    }

    if (showNext) {
      trainLocation.push({
        status: 'STATION',
        station: nextItem.station,
        arrival: nextItem.planTimeArrival,
        arrivalDelay: nextItem.arrivalDelay,
        departure: nextItem.planTimeDeparture,
        departureDelay: nextItem.departureDelay,
      });
      trainLocation.push({ status: 'EMPTY' });
    }

    // LAST
    if (isShortenedAtEnd) {
      trainLocation.push(
        {
          status: inStation && lastAfterShorten.id === arrived.id ? 'TRAIN' : 'STATION',
          style: 'LAST',
          station: lastAfterShorten.station,
          arrival: lastAfterShorten.planTimeArrival,
          arrivalDelay: lastAfterShorten.arrivalDelay,
        },
        {
          status: 'SHORTENED',
          station: lastItem.station,
        },
      );
    } else {
      trainLocation.push({
        status: inStation && lastItem.id === arrived.id ? 'TRAIN' : 'STATION',
        style: 'LAST',
        station: lastItem.station,
        arrival: lastItem.planTimeArrival,
        arrivalDelay: lastItem.arrivalDelay,
      });
    }
    return trainLocation;
  }
}
