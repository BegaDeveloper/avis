import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './components/dash/dash.component';
import { HomeComponent } from './components/home/home.component';
import { IntervalPlanComponent } from './components/interval-plan/interval-plan.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RoutesComponent } from './components/routes/routes.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StationsComponent } from './components/stations/stations.component';
import { TrainsComponent } from './components/trains/trains.component';
import { WeeklySchedulesComponent } from './components/weekly-schedules/weekly-schedules.component';
import { SpecialDaysComponent } from './components/special-days/special-days.component';
import { PlansComponent } from './components/plans/plans.component';
import { UsersComponent } from './components/users/users.component';
import { SettingsComponent } from './components/settings/settings.component';
import { OperatorsComponent } from './components/operators/operators.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { AdminManagementComponent } from './components/admin-management/admin-management.component';
import { DisplayInfoTablesComponent } from './components/display-track-realization/display-info-tables.component';
import { RealizationComponent } from './components/realization/realization.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AudioMessagesComponent } from './components/audio-messages/audio-messages.component';
import { AudioControllerComponent } from './components/audio-controller/audio-controller.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'stations', component: StationsComponent },
      { path: 'trains', component: TrainsComponent },
      { path: 'interval-plan', component: IntervalPlanComponent },
      { path: 'weekly-schedules', component: WeeklySchedulesComponent },
      { path: 'routes', component: RoutesComponent },
      { path: 'special-days', component: SpecialDaysComponent },
      { path: 'plans', component: PlansComponent },
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'operators', component: OperatorsComponent },
      { path: 'jobs', component: JobsComponent },
      { path: 'admin-management', component: AdminManagementComponent },
      { path: 'display-track-realization', component: DisplayInfoTablesComponent },
      { path: 'realization', component: RealizationComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'audio-messages', component: AudioMessagesComponent },
      { path: 'audio-controller', component: AudioControllerComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}

export const routerLinks = [
  NavbarComponent,
  HomeComponent,
  DashComponent,
  SidebarComponent,
  StationsComponent,
  TrainsComponent,
  IntervalPlanComponent,
  RoutesComponent,
  WeeklySchedulesComponent,
  SpecialDaysComponent,
  PlansComponent,
  WeeklySchedulesComponent,
  UsersComponent,
  SettingsComponent,
  OperatorsComponent,
  JobsComponent,
  AdminManagementComponent,
  DisplayInfoTablesComponent,
  RealizationComponent,
  AudioMessagesComponent,
];
