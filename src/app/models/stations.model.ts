import { PremiseType } from '../utils/enums';
import { Base } from './base.model';

export enum StationType {
  STATION = 'Stanica',
  STOP = 'Stajalište',
}

export interface Station extends Base {
  id: number;
  name: string;
  name1: string;
  name2: string;
  name4: string;
  externalId: string;
  searchKey: string;
  stationType: string;
  licensed: boolean;
}

export interface StationPost {
  name: string;
  name1: string;
  name2: string;
  name4: string;
  stationType: string;
  licensed: boolean;
  externalId: string;
}
export class StationData implements StationPost {
  constructor(
    public name: string,
    public name1: string,
    public name2: string,
    public name4: string,
    public stationType: string,
    public licensed: boolean,
    public externalId: string,
  ) {}
}

export interface Track {
  createdDate: Date;
  createdBy: string;
  version: number;
  id: number;
  station: Station;
  trackNumber: number;
}

export interface StationModalData<T> {
  id: number;
  name: string;
  content: T[];
}

export interface SubsequentStation {
  id: number;
  station: Station;
  stationNext: Station;
}

export interface Premise {
  id: number;
  name: string;
  station: Station;
  premiseType: PremiseType;
}
