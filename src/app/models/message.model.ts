export interface MessageDTO {
  stationId: number;
  premiseIds: number[];
  tracks: number[];
  messageText: string;
  emittingDateFrom: Date;
}
