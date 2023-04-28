import { Station } from './stations.model';

export enum Role {
  CONTROLLER = 'CONTROLLER',
  ADMIN = 'ADMIN',
  OPERATER = 'OPERATER',
}

export interface User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  enabled: boolean;
  roles: Role[];
  userStations: UserStation[];
}

export interface UserStation {
  id: number;
  station: Station;
}

export interface UserPost {
  username: string;
  fullName: string;
  password: string;
  enabled: boolean;
}

export class UserData implements UserPost {
  constructor(public username: string, public fullName: string, public password: string, public enabled: boolean) {}
}
