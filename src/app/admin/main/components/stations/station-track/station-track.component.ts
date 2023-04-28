import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESSAGE } from '../../../../../utils/messages';
import { StationService } from '../../../../../services/station.service';
import { SharedService } from '../../../../../services/shared.service';
import { TranslateService } from '../../../../../services/translate.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { StationModalData, Track } from '../../../../../models/stations.model';

@Component({
  selector: 'app-station-track',
  templateUrl: './station-track.component.html',
  styleUrls: ['./station-track.component.scss'],
})
export class StationTrackComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  track1: boolean;
  track2: boolean;
  track3: boolean;
  track4: boolean;
  track5: boolean;
  track6: boolean;
  track7: boolean;
  track8: boolean;
  track9: boolean;
  track10: boolean;
  track11: boolean;
  track12: boolean;
  track13: boolean;
  track14: boolean;
  track15: boolean;
  track16: boolean;
  track17: boolean;
  track18: boolean;
  track19: boolean;
  track20: boolean;
  track21: boolean;
  track22: boolean;
  track23: boolean;
  track24: boolean;
  track25: boolean;
  track26: boolean;
  track27: boolean;
  track28: boolean;
  track29: boolean;
  track30: boolean;
  checkBoxArray: [boolean, number][];
  checkBoxArray2: [boolean, number][];
  checkBoxArray3: [boolean, number][];
  currentlyCheckedTracks: number[] = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: StationModalData<Track>,
    private stationService: StationService,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<StationTrackComponent>,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.data.content.forEach((el: Track) => {
      this.currentlyCheckedTracks.push(el.trackNumber);
    });
    this.data.content.forEach((track: Track) => {
      switch (track.trackNumber) {
        case 1:
          this.track1 = true;
          break;
        case 2:
          this.track2 = true;
          break;
        case 3:
          this.track3 = true;
          break;
        case 4:
          this.track4 = true;
          break;
        case 5:
          this.track5 = true;
          break;
        case 6:
          this.track6 = true;
          break;
        case 7:
          this.track7 = true;
          break;
        case 8:
          this.track8 = true;
          break;
        case 9:
          this.track9 = true;
          break;
        case 10:
          this.track10 = true;
          break;
        case 11:
          this.track11 = true;
          break;
        case 12:
          this.track12 = true;
          break;
        case 13:
          this.track13 = true;
          break;
        case 14:
          this.track14 = true;
          break;
        case 15:
          this.track15 = true;
          break;
        case 16:
          this.track16 = true;
          break;
        case 17:
          this.track17 = true;
          break;
        case 18:
          this.track18 = true;
          break;
        case 19:
          this.track19 = true;
          break;
        case 20:
          this.track20 = true;
          break;
        case 21:
          this.track21 = true;
          break;
        case 22:
          this.track22 = true;
          break;
        case 23:
          this.track23 = true;
          break;
        case 24:
          this.track24 = true;
          break;
        case 25:
          this.track25 = true;
          break;
        case 26:
          this.track26 = true;
          break;
        case 27:
          this.track27 = true;
          break;
        case 28:
          this.track28 = true;
          break;
        case 29:
          this.track29 = true;
          break;
        case 30:
          this.track30 = true;
          break;
        default:
          break;
      }
    });
    this.checkBoxArray = [
      [this.track1, 1],
      [this.track2, 2],
      [this.track3, 3],
      [this.track4, 4],
      [this.track5, 5],
      [this.track6, 6],
      [this.track7, 7],
      [this.track8, 8],
      [this.track9, 9],
      [this.track10, 10],
    ];
    this.checkBoxArray2 = [
      [this.track11, 11],
      [this.track12, 12],
      [this.track13, 13],
      [this.track14, 14],
      [this.track15, 15],
      [this.track16, 16],
      [this.track17, 17],
      [this.track18, 18],
      [this.track19, 19],
      [this.track20, 20],
    ];
    this.checkBoxArray3 = [
      [this.track21, 21],
      [this.track22, 22],
      [this.track23, 23],
      [this.track24, 24],
      [this.track25, 25],
      [this.track26, 26],
      [this.track27, 27],
      [this.track28, 28],
      [this.track29, 29],
      [this.track30, 30],
    ];
  }

  onChecked(event: MatCheckboxChange, trackNumber: number) {
    if (event.checked) {
      this.currentlyCheckedTracks.push(trackNumber);
    } else {
      for (let i = 0; i < this.currentlyCheckedTracks.length; i++) {
        if (this.currentlyCheckedTracks[i] === trackNumber) {
          if (this.currentlyCheckedTracks.length > 1) this.currentlyCheckedTracks.splice(i, 1);
          else if (this.currentlyCheckedTracks.length === 1) this.currentlyCheckedTracks = [];
        }
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.data.content) {
      this.subscription.add(
        this.stationService.postTracks({ trackNumbers: this.currentlyCheckedTracks }, this.data.id)
          .subscribe({
            next: () => {
              this.sharedService.openSnackBar(MESSAGE.success_put);
              this.closeModal();
            },
            error: errorMessage => {
              errorMessage.appCode
                ? this.translateService.showMessage(errorMessage.appCode)
                : this.translateService.showMessage(MESSAGE.error_tracks_save);
            },
          }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
