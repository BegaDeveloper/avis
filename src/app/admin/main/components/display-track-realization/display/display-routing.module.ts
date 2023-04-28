import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArrivalDepartureComponent } from './arrival-departure/arrival-departure.component';
import { DisplayTrackComponent } from './display-track/display-track.component';

const routes: Routes = [
  { path: 'display-track', component: DisplayTrackComponent },
  { path: 'arrivals-display', component: ArrivalDepartureComponent },
  { path: 'departures-display', component: ArrivalDepartureComponent },
  { path: 'departures-arrivals-display', component: ArrivalDepartureComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayRoutingModule {}
