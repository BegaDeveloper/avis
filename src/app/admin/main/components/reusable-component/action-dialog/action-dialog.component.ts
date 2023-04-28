import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { RealizationDetails } from '../../../../../models/realization.model';
import { RealizationService } from '../../../../../services/realization.service';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss'],
})
export class ActionDialogComponent implements OnInit {
  realizationDetails$: Observable<RealizationDetails>;
  @Input() planInstanceId: number;
  @Input() template: TemplateRef<any>;
  @Input() disabled: boolean;
  @Input() title: string;
  @Input() submitTitle: string;
  @Output() submitted = new EventEmitter();

  constructor(private realizationService: RealizationService) {}

  ngOnInit(): void {
    this.realizationDetails$ = this.realizationService.getRealizationDetails(this.planInstanceId);
  }

  submit() {
    this.submitted.emit();
  }
}
