import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StationService } from '../../../../../services/station.service';
import { SharedService } from '../../../../../services/shared.service';
import { TranslateService } from '../../../../../services/translate.service';
import { MESSAGE } from '../../../../../utils/messages';
import { map, Observable, shareReplay, Subscription, switchMap } from 'rxjs';
import { UserService } from '../../../../../services/user.service';
import { Station } from '../../../../../models/stations.model';
import { User, UserStation } from '../../../../../models/user.model';
import { GridModal } from '../../../../../models/grid-modal';

@Component({
  selector: 'app-user-station',
  templateUrl: './user-station.component.html',
  styleUrls: ['./user-station.component.scss'],
})
export class UserStationComponent implements OnInit, OnDestroy {
  allStations$: Observable<Station[]> = this.stationService.get().pipe(shareReplay(1));
  licencedStations$: Observable<Station[]> = this.allStations$.pipe(
    map(stations => stations.filter(station => station.licensed))
  );
  isFormSubmitted: boolean = false;
  userStationForm: FormGroup = this.fb.group({
    selectedStation: ['', Validators.required],
  });
  userStations: UserStation[];
  displayedColumns = ['NAZIV STANICE', 'AKCIJE'];
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: GridModal<User>,
    private stationService: StationService,
    public sharedService: SharedService,
    public dialogRef: MatDialogRef<UserStationComponent>,
    private translateService: TranslateService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userStations = this.data.content.userStations;
  }

  onClickAddStation() {
    this.isFormSubmitted = true;
    if (!this.userStationForm.valid) {
      this.translateService.showMessage(MESSAGE.error_user_station_input);
      return;
    }
    if (this.userStationForm.get('selectedStation')?.value) {
      this.subscription.add(
        this.userService.postUserStation(this.data.id, {
          stationId: this.userStationForm.get('selectedStation')?.value.id
        }).pipe(
          switchMap(() => this.userService.getById(this.data.id))
        ).subscribe({
          next: (res) => {
            this.userStations = res.userStations;
            this.sharedService.openSnackBar(MESSAGE.success_put);
          },
          error: errorMessage => {
            errorMessage.appCode
              ? this.translateService.showMessage(errorMessage.appCode)
              : this.translateService.showMessage(MESSAGE.error_user_stations_save);
          },
        }),
      );
    }
  }

  removeUserStation(id: number) {
    this.subscription.add(
      this.userService.deleteUserStation(id).pipe(
        switchMap(() => this.userService.getById(this.data.id))
      ).subscribe({
        next: (res) => {
          this.userStations = res.userStations;
          this.sharedService.openSnackBar(MESSAGE.success_delete);
        },
        error: errorMessage => {
          errorMessage.appCode
            ? this.translateService.showMessage(errorMessage.appCode)
            : this.translateService.showMessage(MESSAGE.error_user_stations_delete);
        },
      }),
    );
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
