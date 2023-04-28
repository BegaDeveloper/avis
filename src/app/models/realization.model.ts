import { Train } from './trains.modal';
import { Sort } from './shared.model';
import { Station } from './stations.model';
import { EventTypes } from '../utils/enums';
import { Base } from './base.model';

export interface RouteHeader {
  id: number;
  name: string;
}

export interface PlanInstanceItem {
  id: number;
  planInstanceId: number;
  planItemId: number;
  planTimeArrival: Date;
  planTimeDeparture: Date;
  stationId: number;
  track: number;
  transit: boolean;
  station: Station;
}

export interface StationRealizationItem {
  routeHeader: RouteHeader;
  train: Train;
  planInstanceItem: PlanInstanceItem;
  realizationItem: RealizationItem;
  description: string;
  actions: EventTypes[];
}

export interface Pageable {
  offset: number;
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
}

export interface StationRealizationsResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: StationRealizationItem[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}

//Realization details
export interface Operator {
  id: number;
  name: string;
}

export interface Route {
  id: number;
  name: string;
  searchKey: string;
}

export interface RealizationHeader {
  id: number;
  realizationStatus: string;
  train: Train;
  route: Route;
}

export interface RealizationDetailsItem {
  id: number;
  station: Station;
  transit: boolean;
  track: number;
  planTimeArrival?: Date;
  planTimeDeparture?: Date;
  arrivalDelay?: number;
  departureDelay?: number;
  realizationItemStatus: string;
  position: number;
}

export interface RealizationDetails {
  realizationHeader: RealizationHeader;
  realizationDetailsItems: RealizationDetailsItem[];
}

//Interface for realization actions
export type ActionsObject = Record<string, string>;

//Plan instance
export interface PlanInstance extends PlanInstanceHeader {
  planInstanceItems: PlanInstanceItem[];
}

export interface PlanInstanceHeader {
  id: number;
  planDate: Date;
  planId: number;
  train: Train;
  routeHeader: RouteHeader;
}

export interface RealizationItem extends Base {
  id: number;
  realizationId: number;
  realizationItemStatus: string;
  arrivalDelay: number;
  departureDelay: number;
  track: number;
  shortNotification: string;
}

export interface StationArrivalDepartureRealization {
  station: Station;
  infoTableType: string;
  arrivals: StationRealizationItem[];
  departures: StationRealizationItem[];
}

export interface ActionComponentData {
  id: number;
  action: EventTypes;
  selectedStation: Station;
}

export interface StationActionResponse {
  stationActionDataList: StationActionData[];
}

export interface StationActionData {
  station: Station;
  delay: number;
  tracks: number[];
  isDefault: boolean;
}

//Action history

export interface ActionHistory {
  updatedDate: string;
  createdDate: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  id: number;
  action: string;
  planInstanceId: number;
  delay: number;
  station: Station;
  track: number;
}

//enums

export const translationActions: ActionsObject = {
  START: 'Postavljanje na prvu stanicu',
  POSTPONE: 'Odložiti',
  CANCEL: 'Otkazati',
  NOTIFICATION: 'Notifikacije',
  CHANGE_TRACK: 'Promeni kolosek',
  ARRIVAL: 'Dolazak',
  DEPARTURE: 'Polazak',
  CHANGE_ARRIVAL_DELAY: 'Promena kašnjenja dolaska',
  CHANGE_DEPARTURE_DELAY: 'Promena kašnjenja polaska',
  RESET: 'Resetuj',
  SHORTENING: 'Skraćivanje',
};
