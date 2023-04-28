export enum Components {
  STATION = 'stations',
  TRAINS = 'trains',
  INTERVAL_PLAN = 'interval-plan',
  WEEKLY_SCHEDULE = 'weekly-schedule',
  ROUTES = 'routes',
  SPECIAL_DAY = 'special-days',
  USERS = 'users',
  PLANS = 'plans',
}

export enum SpecialDayEnum {
  INCLUDE = 'Praznici uključeni',
  EXCLUDE = 'Praznici isključeni',
  NONE = 'Nije važno',
  EXCLUDE_BEFORE = 'Isključen dan pre praznika',
  INCLUDE_BEFORE = 'Uključen dan pre praznika',
  EXCLUDE_AFTER = 'Isključen dan posle praznika',
  INCLUDE_AFTER = 'Uključen dan posle praznika',
  EXCLUDE_LAST = 'Isključen poslednji dan praznika',
  INCLUDE_LAST = 'Uključen poslednji dan praznika',
  EXCLUDE_FIRST = 'Isključen prvi dan praznika',
  INCLUDE_FIRST = 'Uključen prvi dan praznika',
}

export enum EventTypes {
  DEPARTURE = 'DEPARTURE',
  ARRIVAL = 'ARRIVAL',
  CHANGE_ARRIVAL_DELAY = 'CHANGE_ARRIVAL_DELAY',
  CHANGE_DEPARTURE_DELAY = 'CHANGE_DEPARTURE_DELAY',
  START = 'START',
  POSTPONE = 'POSTPONE',
  CHANGE_TRACK = 'CHANGE_TRACK',
  RESET = 'RESET',
  CANCEL = 'CANCEL',
  SHORTENING = 'SHORTENING',
}

export enum PremiseType {
  VESTIBULE = 'Vestibil',
  UNDERPASS = 'Podhodnik',
}

export enum ActionStatus {
  ACTION_NEEDED = 'ACTION_NEEDED',
  ACTION_DONE = 'ACTION_DONE',
}
