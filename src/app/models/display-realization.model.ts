import { StationRealizationItem } from './realization.model';
import { Station } from './stations.model';

export interface StationTrackRealizationResponse {
  stationRealizationItem: StationRealizationItem;
  station: Station;
  track: number;
}

export class StationTrackRealizationResponse implements StationTrackRealizationResponse {
  stationRealizationItem: StationRealizationItem;
  station: Station;
  track: number;

  constructor(item: StationRealizationItem, station: Station, track: number) {
    this.stationRealizationItem = item;
    this.station = station;
    this.track = track;
  }

  isType() {
    return true;
  }
}
