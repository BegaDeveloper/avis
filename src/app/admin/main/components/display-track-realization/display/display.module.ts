import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisplayRoutingModule } from './display-routing.module';
import { DisplayTrackComponent } from './display-track/display-track.component';
import { ArrivalDepartureComponent } from './arrival-departure/arrival-departure.component';
import { OutOfOrderComponent } from './out-of-order/out-of-order.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [DisplayTrackComponent, ArrivalDepartureComponent, OutOfOrderComponent, WelcomeComponent],
  imports: [CommonModule, DisplayRoutingModule],
})
export class DisplayModule {}
