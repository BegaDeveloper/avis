import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { EventType } from 'src/app/models/arrival-departure.model';
import { RealizationService } from 'src/app/services/realization.service';
import { StationService } from 'src/app/services/station.service';
import { TranslateService } from 'src/app/services/translate.service';
import { Station, Track } from '../../../../models/stations.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-display-info-tables',
  templateUrl: './display-info-tables.component.html',
  styleUrls: ['./display-info-tables.component.scss'],
})
export class DisplayInfoTablesComponent {
  form: FormGroup = this.fb.group({
    stationId: ['', Validators.required],
    track: ['', Validators.required],
  });
  matcher = new MyErrorStateMatcher();
  allStations$: Observable<Station[]> = this.stationService.getLicensed();
  allTracks: Track[];

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private realizationService: RealizationService,
    private translateService: TranslateService,
    private router: Router,
  ) {}

  onSubmit(event: Event) {
    event.preventDefault();

    const stationId = this.form.value.stationId;
    const track = this.form.value.track;

    const queryParams: { [key: string]: any } = {
      'station-id': stationId,
      track: track,
      'info-table-id': -1,
    };

    const navigationExtras: NavigationExtras = {
      queryParams,
    };

    const url = this.router.createUrlTree(['/display-track'], navigationExtras).toString();
    const link = document.createElement('a');
    link.href = `#${url}`;
    link.target = '_blank';
    link.click();
  }

  arrivalDepartureTable(type: EventType | string) {
    const stationId = this.form.value.stationId;
    switch (type) {
      case 'DEPARTURE':
        this.navigateWithQueryParams('/departures-display', stationId);
        break;
      case 'ARRIVAL':
        this.navigateWithQueryParams('/arrivals-display', stationId);
        break;
      case 'ARRIVAL_DEPARTURE':
        this.navigateWithQueryParams('/departures-arrivals-display', stationId);
        break;
    }
  }

  private navigateWithQueryParams(path: string, stationId: number) {
    const queryParams: { [key: string]: any } = {
      'station-id': stationId,
      'info-table-id': -1,
    };

    const navigationExtras: NavigationExtras = {
      queryParams,
    };

    const url = this.router.createUrlTree([path], navigationExtras).toString();
    const link = document.createElement('a');
    link.href = `#${url}`;
    link.target = '_blank';
    link.click();
  }

  tracks(id: number) {
    this.stationService.getTrackById(id).subscribe(res => this.allTracks = res);
  }
}
