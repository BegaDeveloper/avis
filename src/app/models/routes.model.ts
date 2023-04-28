import { Station } from './stations.model';
import { Base } from './base.model';

export interface RouteItem {
  id: number;
  station: Station;
  position: number;
  via: boolean;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updateBy: string;
  version: number;
}

export interface Route extends Base {
  id: number;
  name: string;
  routeItems: RouteItem[];
  searchKey: string;
}

export interface RouteItemDataList {
  stationId: number;
  via: boolean;
}

export interface RouteMain {
  name: string;
  routeItemDataList: RouteItemDataList[];
}

export class RouteData implements RouteMain {
  constructor(public name: string, public routeItemDataList: RouteItemDataList[]) {}
}
