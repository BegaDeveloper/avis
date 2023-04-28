import { Base } from './base.model';

export interface SpecialDays extends Base {
  id: number;
  startYear: number;
  endYear: number;
  month: number;
  day: number;
  name: string;
  searchKey: string;
}

export interface SpecialDaysData {
  id: number;
  day: number;
  month: number;
  startYear: number;
  endYear: number;
  name: string;
}

export class NewSpecialDayData implements SpecialDaysData {
  constructor(
    public id: number,
    public day: number,
    public month: number,
    public startYear: number,
    public endYear: number,
    public name: string,
  ) {}
}
