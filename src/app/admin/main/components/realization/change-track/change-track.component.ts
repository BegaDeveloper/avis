import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { Station, Track } from 'src/app/models/stations.model';
import { ActionsService } from 'src/app/services/actions.service';
import { RealizationService } from 'src/app/services/realization.service';
import { SharedService } from 'src/app/services/shared.service';
import { StationService } from 'src/app/services/station.service';
import { TranslateService } from 'src/app/services/translate.service';
import { MESSAGE } from 'src/app/utils/messages';
import { ActionComponentData } from '../../../../../models/realization.model';
import { EventTypes } from '../../../../../utils/enums';

@Component({
  selector: 'app-change-track',
  templateUrl: './change-track.component.html',
  styleUrls: ['./change-track.component.scss'],
})
export class ChangeTrackComponent implements OnInit {
  name: string = 'Promena koloseka';
  id: number = this.data.id;
  matcher = new MyErrorStateMatcher();
  currentStationId: number;
  currentTrack: number;
  tracks: Track[] = [];
  stations$: Observable<Station[]>;
  private _disabled = false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ActionComponentData,
    public dialogRef: MatDialogRef<ChangeTrackComponent>,
    private actionService: ActionsService,
    private sharedService: SharedService,
    private realizationService: RealizationService,
    private translateService: TranslateService,
    private stationService: StationService,
  ) {}

  ngOnInit(): void {
    this.stations$ = this.realizationService.getStationsForAction(this.data.id, EventTypes.CHANGE_TRACK);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  getTracks(stationId: number) {
    this.stationService.getTrackById(stationId).subscribe({
      next: res => this.tracks = res,
      error: (error: any) => {
        error?.errorMessages?.forEach((err: any) => {
          err
            ? this.translateService.showMessage(err)
            : this.translateService.showMessage(MESSAGE.error_get_realization);
        });
      },
    });
  }

  onSelectStation(event: any) {
    this.currentStationId = event.value;
    this.getTracks(this.currentStationId);
  }

  onSelectTrack(event: any) {
    this.currentTrack = event.value;
  }

  onSubmit() {
    this.disabled = true;
    this.actionService.changeTrack(this.data.id, this.currentStationId, this.currentTrack).subscribe({
      next: () => {
        this.sharedService.openSnackBar(MESSAGE.success_post);
        this.sharedService.reloadGrid();
        this.closeDialog();
      },
      error: () => this.disabled = false,
    });
  }
}
