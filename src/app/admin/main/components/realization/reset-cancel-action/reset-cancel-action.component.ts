import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActionsService } from 'src/app/services/actions.service';
import { SharedService } from 'src/app/services/shared.service';
import { MESSAGE } from 'src/app/utils/messages';
import { ActionComponentData } from '../../../../../models/realization.model';
import { EventTypes } from '../../../../../utils/enums';

@Component({
  selector: 'app-reset-cancel-action',
  templateUrl: './reset-cancel-action.component.html',
  styleUrls: ['./reset-cancel-action.component.scss'],
})
export class ResetCancelActionComponent implements OnInit {
  isReset: boolean;
  name: string = '';
  id: number = this.data.id;
  private _disabled = false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ActionComponentData,
    public dialogRef: MatDialogRef<ResetCancelActionComponent>,
    private actionService: ActionsService,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    if (this.data.action === EventTypes.RESET) {
      this.name = 'Reset';
      this.isReset = true;
    } else {
      this.name = 'Otkazati';
      this.isReset = false;
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
    this.actionService.resetOrCancel(this.data.id, this.data.action).subscribe({
      next: () => {
        if (this.data.action === EventTypes.CANCEL) {
          this.sharedService.openSnackBar(MESSAGE.cancel_success);
        } else {
          this.sharedService.openSnackBar(MESSAGE.reset_success);
        }

        this.sharedService.reloadGrid();
        this.closeDialog();
      },
      error: () => this.disabled = false,
    });
  }
}
