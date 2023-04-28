import { Base } from './base.model';
import { PlanInstanceHeader } from './realization.model';
import { Station } from './stations.model';
import { AudioController } from './audio-controller';

export interface AudioMessageData {
  id: number;
  planInstanceHeader: PlanInstanceHeader;
  station: Station;
  track: number;
  messageTemplateId: number;
  messageText: string;
  emittingDateFrom: Date;
  emittingDateUntil: Date;
  late: boolean;
  obsolete: boolean;
  emitted: boolean;
  emittedDateStart: Date;
  emittedDateEnd: Date;
  errorDetails: string;
  audioController: AudioController;
  priority: number;
  audioZoneList: string;
  ttsFile: TtsFile;
}

export interface TtsFile extends Base {
  id: number;
  message: string;
  fileName: string;
}
