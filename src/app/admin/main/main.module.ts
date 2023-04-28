import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule, routerLinks } from './main-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';
import { StationModalComponent } from './components/stations/station-modal/station-modal.component';
import { DelayedInputDirective } from 'src/app/directives/delayed-input.directive';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { TrainModalComponent } from './components/trains/train-modal/train-modal.component';
import { IntervalModalComponent } from './components/interval-plan/interval-modal/interval-modal.component';
import { AddWeeklyScheduleComponent } from './components/weekly-schedules/add-weekly-schedule/add-weekly-schedule.component';
import { AddRouteComponent } from './components/routes/add-route/add-route.component';
import { SpecialDaysComponent } from './components/special-days/special-days.component';
import { SpecialDaysModalComponent } from './components/special-days/special-days-modal/special-days-modal.component';
import { StationTrackComponent } from './components/stations/station-track/station-track.component';
import { StationSubsequentComponent } from './components/stations/station-subsequent/station-subsequent.component';
import { PreventMultiClickDirective } from 'src/app/directives/multiClick.directive';
import { StationPremisesComponent } from './components/stations/station-premises/station-premises.component';
import { TranslationPipe } from 'src/app/pipes/translate.pipe';
import { AddPlanComponent } from './components/plans/add-plan/add-plan.component';
import { PlanDetailComponent } from './components/plans/plan-detail/plan-detail.component';
import { UserModalComponent } from './components/users/user-modal/user-modal.component';
import { UserRoleComponent } from './components/users/user-role/user-role.component';
import { UserStationComponent } from './components/users/user-station/user-station.component';
import { DuplicatePlanComponent } from './components/plans/duplicate-plan/duplicate-plan.component';
import { FormatTimeDirective } from 'src/app/directives/time-format.directive';
import { CutPlanComponent } from './components/plans/cut-plan/cut-plan.component';
import { SearchComponent } from './components/reusable-component/search/search.component';
import { AdminManagementComponent } from './components/admin-management/admin-management.component';
import { DisplayModule } from './components/display-track-realization/display/display.module';
import { RealizationDetailsComponent } from './components/realization/realization-details/realization-details.component';
import { StartPostponeActionComponent } from './components/realization/start-postpone-action/start-postpone-action.component';
import { ResetCancelActionComponent } from './components/realization/reset-cancel-action/reset-cancel-action.component';
import { ActionHeaderComponent } from './components/reusable-component/action-header/action-header.component';
import { ArrivalsDeparturesComponent } from './components/realization/arrivals-departures/arrivals-departures.component';
import { ChangeTrackComponent } from './components/realization/change-track/change-track.component';
import { AddOperatorComponent } from './components/operators/add-operator/add-operator.component';
import { RouteShorteningComponent } from './components/realization/route-shortening/route-shortening.component';
import { SafePipe } from '../../pipes/safe.pipe';
import { MessagesComponent } from './components/messages/messages.component';
import { ActionDialogComponent } from './components/reusable-component/action-dialog/action-dialog.component';
import { TrainLocationComponent } from './components/reusable-component/train-location/train-location.component';
import { AudioControllerComponent } from './components/audio-controller/audio-controller.component';
import { AudioControllerEditComponent } from './components/audio-controller/edit/audio-controller-edit.component';

@NgModule({
  declarations: [
    routerLinks,
    DeleteModalComponent,
    StationModalComponent,
    DelayedInputDirective,
    SearchPipe,
    SafePipe,
    TrainModalComponent,
    IntervalModalComponent,
    AddWeeklyScheduleComponent,
    AddRouteComponent,
    SpecialDaysComponent,
    SpecialDaysModalComponent,
    StationTrackComponent,
    StationSubsequentComponent,
    PreventMultiClickDirective,
    StationPremisesComponent,
    TranslationPipe,
    AddPlanComponent,
    PlanDetailComponent,
    UserModalComponent,
    UserRoleComponent,
    UserStationComponent,
    DuplicatePlanComponent,
    FormatTimeDirective,
    CutPlanComponent,
    SearchComponent,
    AdminManagementComponent,
    RealizationDetailsComponent,
    StartPostponeActionComponent,
    ResetCancelActionComponent,
    ActionHeaderComponent,
    ArrivalsDeparturesComponent,
    ChangeTrackComponent,
    AddOperatorComponent,
    RouteShorteningComponent,
    MessagesComponent,
    ActionDialogComponent,
    TrainLocationComponent,
    AudioControllerComponent,
    AudioControllerEditComponent,
  ],
  imports: [CommonModule, MainRoutingModule, FormsModule, ReactiveFormsModule, MaterialModule, DisplayModule],
  exports: [TranslationPipe, DisplayModule],
})
export class MainModule {}
