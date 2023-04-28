import { SpecialDayEnum } from '../utils/enums';

interface WeeklyScheduleData {
  name: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  specialDayIndicator: SpecialDayEnum;
}

export interface WeeklySchedule extends WeeklyScheduleData {
  id: number;
}

export class WeeklyData implements WeeklyScheduleData {
  constructor(
    public name: string,
    public monday: boolean,
    public tuesday: boolean,
    public wednesday: boolean,
    public thursday: boolean,
    public friday: boolean,
    public saturday: boolean,
    public sunday: boolean,
    public specialDayIndicator: SpecialDayEnum,
  ) {}
}
