import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MyErrorStateMatcher } from 'src/app/directives/error-directive.directive';
import { ActionsService } from 'src/app/services/actions.service';
import { SharedService } from 'src/app/services/shared.service';
import { EventTypes } from 'src/app/utils/enums';
import { MESSAGE } from 'src/app/utils/messages';
import { ActionComponentData } from '../../../../../models/realization.model';

@Component({
  selector: 'app-start-postpone-action',
  templateUrl: './start-postpone-action.component.html',
  styleUrls: ['./start-postpone-action.component.scss'],
})
export class StartPostponeActionComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  delay: number = 0;
  name: string;
  id: number = this.data.id;
  isStart: boolean;
  private _disabled = false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ActionComponentData,
    public dialogRef: MatDialogRef<StartPostponeActionComponent>,
    private actionService: ActionsService,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    if (this.data.action === EventTypes.START) {
      this.name = 'Postavljanje na prvu stanicu';
      this.isStart = true;
    } else if (this.data.action === EventTypes.POSTPONE) {
      this.name = 'Odložiti';
      this.isStart = false;
    }
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
    this.disabled = true;
    this.actionService.getData(this.data.id, this.delay, this.data.action).subscribe({
      next: () => {
        this.sharedService.openSnackBar(MESSAGE.success_post);
        this.closeDialog();
        this.sharedService.reloadGrid();
      },
      error: () => this.disabled = false,
    });
  }
}
