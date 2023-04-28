import { Base } from './base.model';

export interface Params {
  planId: number;
}

export interface Job extends Base {
  id: number;
  type: string;
  status: string;
  userId: number;
  params: Params;
  result: string;
  error: string;
}
