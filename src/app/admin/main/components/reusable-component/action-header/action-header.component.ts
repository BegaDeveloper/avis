import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PlanInstance, PlanInstanceItem } from 'src/app/models/realization.model';
import { ActionsService } from 'src/app/services/actions.service';

@Component({
  selector: 'app-action-header',
  templateUrl: './action-header.component.html',
})
export class ActionHeaderComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() id: number;
  @Input() type: boolean;
  @Input() arrival: boolean;
  @Input() currentStationId: number | null;
  planInstanceItems: PlanInstanceItem[];
  stationData?: PlanInstanceItem;

  planInstance$: Observable<PlanInstance>;
  constructor(
    private actionsServices: ActionsService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentStationId']) {
      this.stationData = this.planInstanceItems?.find((el: PlanInstanceItem) => el.station.id == this.currentStationId);
    }
  }

  ngOnInit() {
    this.planInstance$ = this.actionsServices.getPlanInstance(this.id).pipe(
      tap(planeInstance => this.planInstanceItems = planeInstance.planInstanceItems),
    );
  }

}
