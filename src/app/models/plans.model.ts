import { WeeklySchedule } from './weekly.model';
import { Route, RouteItem } from './routes.model';
import { RouteHeader } from './realization.model';
import { Train } from './trains.modal';
import { Base } from './base.model';

export interface PlanInterval {
  id: number;
  startDate: Date;
  endDate: Date;
  name: string;
  description: string;
  searchKey: string;
}

export interface Operator {
  id: number;
  name: string;
}

export interface Unit {
  dateBased: boolean;
  timeBased: boolean;
  durationEstimated: boolean;
}

export interface TimeArrival {
  seconds: number;
  nano: number;
  negative: boolean;
  zero: boolean;
  units: Unit[];
}

export interface TimeDeparture {
  seconds: number;
  nano: number;
  negative: boolean;
  zero: boolean;
  units: Unit[];
}

export interface PlanItem extends Base {
  id: number;
  routeItem: RouteItem;
  timeArrival: TimeArrival;
  timeDeparture: TimeDeparture;
  transit: boolean;
  track: number;
}

export interface PlanHeader {
  id: number;
  planInterval: PlanInterval;
  weekSchedule: WeeklySchedule;
  route: RouteHeader;
  trainId: number;
  active: boolean;
  cutDate: string;
  searchKey: string;
}

/////POST
export interface Time {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface TimeArrival {
  day: number;
  time: Time;
}

export interface Time2 {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface TimeDeparture {
  day: number;
  time: Time2;
}

export interface PostPlanData {
  planIntervalId: number;
  weekScheduleId: number;
  routeId: number;
  trainId: number;
  planItems: PlanItem[];
}

export interface Plan {
  id: number;
  planInterval: PlanInterval;
  weekSchedule: WeeklySchedule;
  route: Route;
  train: Train;
  active: boolean;
  cutDate: Date;
  searchKey: string;
  planItems: PlanItem[];
}

export class PostPlan implements PostPlanData {
  constructor(
    public planIntervalId: number,
    public weekScheduleId: number,
    public routeId: number,
    public trainId: number,
    public planItems: PlanItem[],
  ) {}
}

export interface CutInterval {
  minDate: Date;
  maxDate: Date;
}
