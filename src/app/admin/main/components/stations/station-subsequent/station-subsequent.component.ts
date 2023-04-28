import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, EMPTY, Observable, of, Subscription, switchMap } from 'rxjs';
import { StationService } from '../../../../../services/station.service';
import { SharedService } from '../../../../../services/shared.service';
import { TranslateService } from '../../../../../services/translate.service';
import { MESSAGE } from '../../../../../utils/messages';
import { MyErrorStateMatcher } from '../../../../../directives/error-directive.directive';
import { Station, StationModalData, SubsequentStation } from '../../../../../models/stations.model';

@Component({
  selector: 'app-station-subsequent',
  templateUrl: './station-subsequent.component.html',
  styleUrls: ['./station-subsequent.component.scss'],
})
export class StationSubsequentComponent implements OnInit, OnDestroy {
  allStations$: Observable<Station[]> = this.stationService.get().pipe(
    catchError(error => {
      error.errorMessages.forEach((err: any) => {
        err
          ? this.translateService.showMessage(err)
          : this.translateService.showMessage(MESSAGE.error_station_get);
      });
      return of([] as Station[])
    }),
  );
  subsequentStations: SubsequentStation[];
  subsequentStationForm: FormGroup = this.fb.group({
    selectedStation: ['', Validators.required],
  });
  matcher = new MyErrorStateMatcher();
  isFormSubmitted: boolean = false;
  displayedColumns = ['NAZIV SUSEDNE STANICE', 'AKCIJE'];
  subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: StationModalData<SubsequentStation>,
    private stationService: StationService,
    public sharedService: SharedService,
    public dialogRef: MatDialogRef<StationSubsequentComponent>,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.subsequentStations = this.data.content;
  }

  removeSubsequentStation(id: number) {
    this.subscription.add(
      this.stationService.deleteSubsequentStation(id).pipe(
        switchMap(() =>
          this.stationService.getSubsequentStations(this.data.id).pipe(
            catchError(error => {
              error.errorMessages.forEach((err: any) => {
                err
                  ? this.translateService.showMessage(err)
                  : this.translateService.showMessage(MESSAGE.error_subsequent_station_load);
              });
              return EMPTY;
            }),
          )
        ),
      ).subscribe({
        next: (res) => {
          this.subsequentStations = res;
          this.sharedService.openSnackBar(MESSAGE.success_delete);
        },
        error: errorMessage => {
          errorMessage.appCode
            ? this.translateService.showMessage(errorMessage.appCode)
            : this.translateService.showMessage(MESSAGE.error_subsequent_station_delete);
        },
      }),
    );
  }

  onClickAddSubStation() {
    this.isFormSubmitted = true;
    if (!this.subsequentStationForm.valid) {
      this.translateService.showMessage(MESSAGE.error_subsequent_station_input);
      return;
    }
    if (this.subsequentStationForm.get('selectedStation')?.value) {
      this.subscription.add(
        this.stationService.postSubsequentStation(this.data.id, {
          nextStationId: this.subsequentStationForm.get('selectedStation')?.value.id,
        }).pipe(
          switchMap(() =>
            this.stationService.getSubsequentStations(this.data.id).pipe(
              catchError(error => {
                error.errorMessages.forEach((err: any) => {
                  err
                    ? this.translateService.showMessage(err)
                    : this.translateService.showMessage(MESSAGE.error_subsequent_station_load);
                });
                return EMPTY;
              }),
            )
          ),
        ).subscribe({
          next: (res) => {
            this.subsequentStations = res;
            this.sharedService.openSnackBar(MESSAGE.success_put);
          },
          error: errorMessage => {
            errorMessage.appCode
              ? this.translateService.showMessage(errorMessage.appCode)
              : this.translateService.showMessage(MESSAGE.error_subsequent_station_edit);
          },
        }),
      );
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
