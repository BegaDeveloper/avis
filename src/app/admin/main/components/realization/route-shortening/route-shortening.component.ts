import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { ActionComponentData, StationActionResponse } from 'src/app/models/realization.model';
import { Station } from 'src/app/models/stations.model';
import { ActionsService } from 'src/app/services/actions.service';
import { RealizationService } from 'src/app/services/realization.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateService } from 'src/app/services/translate.service';
import { EventTypes } from 'src/app/utils/enums';
import { MESSAGE } from 'src/app/utils/messages';

@Component({
  selector: 'app-route-shortening',
  templateUrl: './route-shortening.component.html',
  styleUrls: ['./route-shortening.component.scss'],
})
export class RouteShorteningComponent {
  form: FormGroup = this.fb.group({
    startRoute: [''],
    endRoute: [''],
  });
  private _disabled = false;
  matcher = new MyErrorStateMatcher();
  endStations$: Observable<Station[]> = of([]);
  stations$: Observable<Station[]> = this.realizationService
    .stationsForAction(this.data.selectedStation.id, this.data.id, EventTypes.SHORTENING)
    .pipe(
      map((res: StationActionResponse) => res.stationActionDataList.map(data => data.station)),
      switchMap((stations: Station[]) => {
        if (this.data?.id) {
          const id = this.data.id;
          const startStation = stations.find((item: Station) => item.id === id);
          if (startStation) {
            this.form.get('startRoute')?.setValue(startStation.id);
          }
        }
        return of(stations);
      }),
    );

  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ActionComponentData,
    public dialogRef: MatDialogRef<RouteShorteningComponent>,
    private translateService: TranslateService,
    private actionsServices: ActionsService,
    private realizationService: RealizationService,
  ) {}

  set disabled(value: boolean) {
    this._disabled = value;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  closeModal() {
    this.dialogRef.close();
  }

  selectStation(e: MatSelectChange) {
    const selectedStationId = e.value;
    this.stations$.subscribe(allStations => {
      const selectedStationIndex = allStations.findIndex((station: Station) => station.id === selectedStationId);

      if (selectedStationIndex >= 0) {
        const endStations = allStations.slice(selectedStationIndex + 1);
        this.form.get('endRoute')?.setValue('');
        this.endStations$ = of(endStations);
      } else {
        this.endStations$ = of([]);
      }
    });
  }
  onSubmit() {
    if (this.form.valid) {
      this.disabled = true;
      const firstStation = this.form.get('startRoute')?.value;
      const secondStation = this.form.get('endRoute')?.value;

      this.actionsServices.shortening(this.data.id, firstStation, secondStation).subscribe({
        next: () => {
          this.disabled = false;
          this.closeModal();
          this.sharedService.reloadGrid();
          this.sharedService.openSnackBar(MESSAGE.success_shortening);
        },
        error: () => (this.disabled = false),
      });
    }
  }
}
