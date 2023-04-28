import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { ActionsService } from 'src/app/services/actions.service';
import { RealizationService } from 'src/app/services/realization.service';
import { SharedService } from 'src/app/services/shared.service';
import { EventTypes } from 'src/app/utils/enums';
import { MESSAGE } from 'src/app/utils/messages';
import { ActionComponentData, StationActionData, StationActionResponse } from '../../../../../models/realization.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-arrivals-departures',
  templateUrl: './arrivals-departures.component.html',
  styleUrls: ['./arrivals-departures.component.scss'],
})
export class ArrivalsDeparturesComponent implements OnInit {
  form: FormGroup = this.fb.group({
    station: ['', Validators.required],
    delay: [0, Validators.required],
  });
  name: string;
  matcher = new MyErrorStateMatcher();
  type: boolean = false;
  arrival: boolean;
  stationId: number;
  stations$: Observable<StationActionData[]>;
  currentStationId: number;
  private _disabled = false;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ActionComponentData,
    public dialogRef: MatDialogRef<ArrivalsDeparturesComponent>,
    private actionService: ActionsService,
    private sharedService: SharedService,
    private realizationService: RealizationService,
  ) {}

  ngOnInit(): void {
    this.stations$ = this.realizationService
      .stationsForAction(this.data.selectedStation.id, this.data.id, this.data.action)
      .pipe(
        map((stationForAction: StationActionResponse) => stationForAction.stationActionDataList),
        tap(stations => {
          const firstStation = stations.find(station => station.isDefault) || stations[0];
          if (firstStation) {
            this.form.get('station')!.setValue(firstStation.station.id);
            this.form.get('delay')!.setValue(firstStation.delay);
          }
        }),
        shareReplay(1),
      );

    switch (this.data.action) {
      case EventTypes.DEPARTURE:
        this.name = 'Polazak voza';
        this.type = true;
        this.arrival = false;
        break;
      case EventTypes.ARRIVAL:
        this.name = 'Dolazak voza';
        this.type = true;
        this.arrival = true;
        break;
      case EventTypes.CHANGE_ARRIVAL_DELAY:
        this.name = 'Promena kašnjenja dolaska';
        this.type = true;
        this.arrival = true;
        break;
      case EventTypes.CHANGE_DEPARTURE_DELAY:
        this.name = 'Promena kašnjenja polaska';
        this.type = true;
        this.arrival = false;
        break;
    }
  }

  onSelect(event: any) {
    this.currentStationId = event.value;

    this.stations$.subscribe((stations: StationActionData[]) => {
      const selectedStation = stations.find(station => station.station.id === this.currentStationId);
      if (selectedStation) {
        this.form.get('delay')!.setValue(selectedStation.delay);
      }
    });
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

  onSubmit() {
    if (this.form.valid) {
      this.disabled = true;
      const station = this.form.get('station')?.value;
      const delay = this.form.get('delay')?.value;
      this.actionService.arriveDepart(this.data.action, station, this.data.id, delay).subscribe({
        next: () => {
          this.sharedService.openSnackBar(MESSAGE.success_post);
          this.sharedService.reloadGrid();
          this.closeDialog();
        },
        error: () => (this.disabled = false),
      });
    }
  }
}
