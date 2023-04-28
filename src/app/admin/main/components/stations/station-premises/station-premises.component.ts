import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { KeyValue } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, EMPTY, Subscription, switchMap } from 'rxjs';
import { StationService } from '../../../../../services/station.service';
import { SharedService } from '../../../../../services/shared.service';
import { TranslateService } from '../../../../../services/translate.service';
import { MESSAGE } from '../../../../../utils/messages';
import { MyErrorStateMatcher } from '../../../../../directives/error-directive.directive';
import { Premise, StationModalData } from '../../../../../models/stations.model';
import { PremiseType } from '../../../../../utils/enums';

@Component({
  selector: 'app-station-premises',
  templateUrl: './station-premises.component.html',
  styleUrls: ['./station-premises.component.scss'],
})
export class StationPremisesComponent implements OnInit, OnDestroy {
  premises: Premise[];
  premisesForm: FormGroup = this.fb.group({
    promiseName: ['', Validators.required],
    selectedPromiseType: ['', Validators.required],
  });
  isFormSubmitted: boolean = false;
  matcher = new MyErrorStateMatcher();
  subscription: Subscription = new Subscription();
  displayedColumns = ['NAZIV PROSTORIJE', 'TIP PROSTORIJE', 'AKCIJE'];
  premiseTypes = PremiseType;

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: StationModalData<Premise>,
    private stationService: StationService,
    public sharedService: SharedService,
    public dialogRef: MatDialogRef<StationPremisesComponent>,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.premises = this.data.content;
  }

  removePremiseStation(id: number) {
    this.subscription.add(
      this.stationService.deleteStationPremises(id).pipe(
        switchMap(() =>
          this.stationService.getStationPremises(this.data.id).pipe(
            catchError( error => {
              error.errorMessages.forEach((err: any) => {
                err
                  ? this.translateService.showMessage(err)
                  : this.translateService.showMessage(MESSAGE.error_premises_station_load);
              });
              return EMPTY;
            }),
          ),
        ),
      ).subscribe({
        next: res => {
          this.premises = res;
          this.sharedService.openSnackBar(MESSAGE.success_delete);
        },
        error: errorMessage => {
          errorMessage.appCode
            ? this.translateService.showMessage(errorMessage.appCode)
            : this.translateService.showMessage(MESSAGE.error_premises_station_delete);
        },
      }),
    );
  }

  onClickAddPremiseStation() {
    this.isFormSubmitted = true;
    if (!this.premisesForm.valid) {
      this.translateService.showMessage(MESSAGE.error_premises_station_input);
      return;
    }
    this.subscription.add(
      this.stationService.postStationPremises(this.data.id, {
        premiseType: this.premisesForm.get('selectedPromiseType')?.value,
        name: this.premisesForm.get('promiseName')?.value,
      }).pipe(
        switchMap(() =>
          this.stationService.getStationPremises(this.data.id).pipe(
            catchError( error => {
              error.errorMessages.forEach((err: any) => {
                err
                  ? this.translateService.showMessage(err)
                  : this.translateService.showMessage(MESSAGE.error_premises_station_load);
              });
              return EMPTY;
            }),
          ),
        ),
      ).subscribe({
        next: res => {
          this.premises = res;
          this.sharedService.openSnackBar(MESSAGE.success_put);
        },
        error: errorMessage => {
          errorMessage.appCode
            ? this.translateService.showMessage(errorMessage.appCode)
            : this.translateService.showMessage(MESSAGE.error_premises_station_edit);
        },
      }),
    );
  }

  returnPremiseType(premiseType: keyof typeof PremiseType) {
    return this.premiseTypes[premiseType];
  }

  closeModal() {
    this.dialogRef.close();
  }

  originalOrder = (a: KeyValue<string,PremiseType>, b: KeyValue<string,PremiseType>): number => {
    return 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
