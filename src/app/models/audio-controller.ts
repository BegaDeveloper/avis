import { Base } from './base.model';

export interface AudioController extends Base {
  id: number;
  name: string;
  apiUrl: string;
  enabled: boolean;
  searchKey: string;
}

export interface AudioControllerData {
  name: string;
  enabled: boolean;
}
