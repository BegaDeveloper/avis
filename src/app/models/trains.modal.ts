import { Operator } from './operators.model';
import { Base } from './base.model';

export interface TrainCategory {
  id: number;
  name: string;
  code: string;
}

export interface Train extends Base {
  id: number;
  name: string;
  trainCategory: TrainCategory;
  operator: Operator;
  searchKey: string;
}

export interface TrainData {
  id: string;
  operatorId: string;
  categoryId: string;
  name: string;
}

export class NewTrainData implements TrainData {
  constructor(public id: string, public operatorId: string, public categoryId: string, public name: string) {}
}
