export interface IntervalPlanInterface {
  startDate: string;
  endDate: string;
  name: string;
  description: string;
}

export class IntervalPlanData implements IntervalPlanInterface {
  constructor(public startDate: string, public endDate: string, public name: string, public description: string) {}
}
